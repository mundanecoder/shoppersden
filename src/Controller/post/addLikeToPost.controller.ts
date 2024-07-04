import { FastifyInstance, FastifyReply } from "fastify";

import {
  NotFoundResponseSchema,
  ServerErrorResponseSchema,
  UnAuthorizedResponseSchema,
} from "../../schemas/error.schema";
import { addLikeToPostService } from "../../services/post/likePost.service";

export default async function addLIkeToPost(fastify: FastifyInstance) {
  fastify.patch<{ Params: { postId: string } }>(
    "/like/:postId",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            postId: { type: "string" },
          },
          required: ["postId"],
        },
        response: {
          "500": ServerErrorResponseSchema,
          "401": UnAuthorizedResponseSchema,
          "404": NotFoundResponseSchema,
        },
        tags: ["post"],
      },
    },
    async (request, reply) => {
      const { postId } = request.params;

      console.log(postId, "postId");

      const userData = request.user;
      try {
        const result = await addLikeToPostService({
          postId: postId,
          userId: userData?._MongoId!,
        });
        reply.status(201).send(result);
      } catch (error) {
        console.error("Error creating post:", error);
        reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
}
