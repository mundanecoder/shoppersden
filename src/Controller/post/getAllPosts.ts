// src/Routes/getPostsByUser.ts
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import {
  GetPostsByUserIdResponseSchema,
  GetPostsByUserIdResponse,
} from "../../Schemas/post/post.schema";
import {
  NotFoundResponseSchema,
  ServerErrorResponseSchema,
  UnAuthorizedResponseSchema,
} from "../../Schemas/error.schema";
import Post from "../../Models/PostModel";
import User from "../../Models/UserModel";

export default async function getPostsByUser(fastify: FastifyInstance) {
  fastify
    .withTypeProvider<TypeBoxTypeProvider>()
    .get<{ Reply: GetPostsByUserIdResponse }>(
      "/",
      {
        schema: {
          response: {
            200: GetPostsByUserIdResponseSchema,
            401: UnAuthorizedResponseSchema,
            404: NotFoundResponseSchema,
            500: ServerErrorResponseSchema,
          },
        },
      },
      async (req: FastifyRequest, rep: FastifyReply) => {
        try {
          const userData = req.user;
          const userExist = await User.findOne({
            clerkId: userData?.id,
          });

          if (!userExist) {
            return rep.status(401).send({
              error: "Unauthorized",
              message: "User does not exist",
            });
          }

          console.log(userExist, "userExist");

          const posts = await Post.find({ userId: userExist?._id }).sort({
            createdAt: -1,
          });

          if (posts.length === 0) {
            return rep.status(404).send({
              error: "Not Found",
              message: "No posts found for the given user ID",
            });
          }

          return rep.status(200).send({
            message: true,
            data: posts,
          });
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
