import { FastifyInstance, FastifyReply } from "fastify";
import {
  NotFoundResponseSchema,
  ServerErrorResponseSchema,
  UnAuthorizedResponseSchema,
} from "../../schemas/error.schema";
import { addLikeToCommentService } from "../../services/comments/addLIkeToComment.service";

export default async function addLikeToComment(fastify: FastifyInstance) {
  fastify.patch<{ Params: { commentId: string } }>(
    "/like/:commentId",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            commentId: { type: "string" },
          },
          required: ["commentId"],
        },
        response: {
          "500": ServerErrorResponseSchema,
          "401": UnAuthorizedResponseSchema,
          "404": NotFoundResponseSchema,
        },
        tags: ["comment"],
      },
    },
    async (request, reply) => {
      const { commentId } = request.params;
      const userData = request.user;

      console.log(commentId, "commentId");

      try {
        const result = await addLikeToCommentService({
          commentId: commentId,
          userId: userData?._MongoId!,
        });
        reply.status(201).send(result);
      } catch (error) {
        console.error("Error liking comment:", error);
        reply.status(500).send({ message: "Internal Server Error" });
      }
    }
  );
}
