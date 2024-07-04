import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import {
  GetPostsByUserIdResponseSchema,
  GetPostsByUserIdResponse,
} from "../../schemas/post/post.schema";
import {
  NotFoundResponseSchema,
  ServerErrorResponseSchema,
  UnAuthorizedResponseSchema,
} from "../../schemas/error.schema";
import { getPostsByUserService } from "../../services/post/getAllPosts.service";

export default async function getPostsByUser(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().get<{
    Querystring: { page: number; limit: number };
    Reply: GetPostsByUserIdResponse;
  }>(
    "/",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            page: { type: "number", default: 1 },
            limit: { type: "number", default: 10 },
          },
          required: ["page", "limit"],
        },
        response: {
          200: GetPostsByUserIdResponseSchema,
          401: UnAuthorizedResponseSchema,
          404: NotFoundResponseSchema,
          500: ServerErrorResponseSchema,
        },
        tags: ["post"],
      },
    },
    async (
      req: FastifyRequest<{ Querystring: { page: number; limit: number } }>,
      rep: FastifyReply
    ) => {
      try {
        // Log request data for debugging
        console.log("Request query:", req.query);

        const userData = req.user;

        if (!userData?._MongoId) {
          return rep.status(401).send({
            error: "Unauthorized",
            message: "User does not exist",
          });
        }

        const { page, limit } = req.query;

        const result = await getPostsByUserService(
          userData?._MongoId,
          page,
          limit
        );

        // Log result for debugging
        console.log("Result from service:", result);

        if ("error" in result) {
          const statusCode =
            result.error === "Unauthorized"
              ? 401
              : result.error === "Not Found"
              ? 404
              : 500;
          return rep.status(statusCode).send(result);
        }

        return rep.status(200).send(result);
      } catch (error) {
        console.error("Error in getPostsByUser route:", error);
        return rep.status(500).send({
          error: "Internal Server Error",
          message: "An error occurred while fetching posts",
        });
      }
    }
  );
}
