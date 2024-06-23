import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import {
  GetCommentsByUserIdResponseSchema,
  GetCommentsByUserIdResponse,
} from "../../Schemas/comments/comments.schema";
import {
  NotFoundResponseSchema,
  ServerErrorResponseSchema,
  UnAuthorizedResponseSchema,
} from "../../Schemas/error.schema";
import { getCommentsByCommentIdService } from "../../Services/comments/getCommentsById.service";

export default async function getCommentsByCommentId(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().get<{
    Querystring: { page: number; limit: number };
    Params: { commentId: string };
    Reply: GetCommentsByUserIdResponse;
  }>(
    "/:commentId",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            commentId: { type: "string" },
          },
          required: ["commentId"],
        },
        querystring: {
          type: "object",
          properties: {
            page: { type: "number", default: 1 },
            limit: { type: "number", default: 10 },
          },
          required: ["page", "limit"],
        },
        response: {
          200: GetCommentsByUserIdResponseSchema,
          401: UnAuthorizedResponseSchema,
          404: NotFoundResponseSchema,
          500: ServerErrorResponseSchema,
        },
        tags: ["comment"],
      },
    },
    async (
      req: FastifyRequest<{
        Querystring: { page: number; limit: number };
        Params: { commentId: string };
      }>,
      rep: FastifyReply
    ) => {
      try {
        console.log("Request query:", req.query);
        console.log("Request params:", req.params);

        const userData = req.user;

        if (!userData?._MongoId) {
          return rep.status(401).send({
            error: "Unauthorized",
            message: "User does not exist",
          });
        }

        const { page, limit } = req.query;
        const { commentId } = req.params;

        const result = await getCommentsByCommentIdService(
          commentId,
          userData._MongoId,
          page,
          limit
        );

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
        console.error("Error in getCommentsByCommentId route:", error);
        return rep.status(500).send({
          error: "Internal Server Error",
          message: "An error occurred while fetching comments",
        });
      }
    }
  );
}
