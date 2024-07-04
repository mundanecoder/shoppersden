import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { deleteReplyService } from "../../services/Reply/deleteReply.service";
import {
  NotFoundResponseSchema,
  ServerErrorResponseSchema,
  UnAuthorizedResponseSchema,
} from "../../schemas/error.schema";

export default async function deleteReplyController(fastify: FastifyInstance) {
  fastify.delete<{ Params: { replyId: string } }>(
    "/:replyId",
    {
      schema: {
        params: { replyId: { type: "string" } },
        response: {
          401: UnAuthorizedResponseSchema,
          404: NotFoundResponseSchema,
          500: ServerErrorResponseSchema,
        },
        tags: ["reply"],
      },
    },
    async (request, reply) => {
      const { replyId } = request.params;

      try {
        const success = await deleteReplyService(replyId);

        if (!success) {
          return reply.status(404).send({ error: "Reply not found" });
        }

        return reply.send({
          success: true,
          message: "Reply deleted successfully",
        });
      } catch (error) {
        console.error("Error deleting reply:", error);
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
}
