import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { deleteCommentService } from "../../Services/comments/deleteComments.service";
import {
  NotFoundResponseSchema,
  ServerErrorResponseSchema,
  UnAuthorizedResponseSchema,
} from "../../Schemas/error.schema";
interface ErrorResponse {
  error: string;
}

export default async function deleteCommentController(
  fastify: FastifyInstance
) {
  fastify.delete<{ Params: { commentId: string } }>(
    "/:commentId",
    {
      schema: {
        params: { commentId: { type: "string" } },
        response: {
          401: UnAuthorizedResponseSchema,
          404: NotFoundResponseSchema,
          500: ServerErrorResponseSchema,
        },
        description: "an  api to delete a comment",
        tags: ["comment"],
      },
    },
    async (request, reply) => {
      const { commentId } = request.params;

      try {
        const success = await deleteCommentService(commentId);

        if (!success) {
          return reply.status(404).send({ error: "Comment not found" });
        }

        return reply.send({
          success: true,
          message: "Comment deleted successfully",
        });
      } catch (error) {
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
}
