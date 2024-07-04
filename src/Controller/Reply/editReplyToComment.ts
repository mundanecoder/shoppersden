import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  EditReplyRequestSchema,
  EditReplyResponseSchema,
} from "../../Schemas/reply/reply.schema";
import {
  NotFoundResponseSchema,
  ServerErrorResponseSchema,
  UnAuthorizedResponseSchema,
} from "../../Schemas/error.schema";
import { editReplyService } from "../../Services/Reply/editReply.service";

interface EditReplyRequest extends FastifyRequest {
  params: { replyId: string };
  body: typeof EditReplyRequestSchema;
}

export default async function editReplyToComment(fastify: FastifyInstance) {
  fastify.put<{
    Params: { replyId: string };
    Body: typeof EditReplyRequestSchema;
  }>(
    "/:replyId",
    {
      schema: {
        params: { replyId: { type: "string" } },
        body: EditReplyRequestSchema,
        response: {
          200: EditReplyResponseSchema,
          401: UnAuthorizedResponseSchema,
          404: NotFoundResponseSchema,
          500: ServerErrorResponseSchema,
        },
        tags: ["reply"],
      },
    },
    async (request: EditReplyRequest, reply: FastifyReply) => {
      const { replyId } = request.params;
      const { content, media } = request.body;
      const userData = request.user;

      try {
        const result = await editReplyService({
          replyId,
          userId: userData?._MongoId!,
          content,
          media,
        });
        reply.status(200).send({ success: true, reply: result });
      } catch (error: any) {
        console.error("Error editing comment:", error as Error);
        if (error.message === "Comment not found") {
          reply
            .status(404)
            .send({ message: error.message, error: "Comment not found" });
        } else if (error.message === "Unauthorized") {
          reply
            .status(401)
            .send({ message: error.message, error: "Unauthorized" });
        } else {
          reply
            .status(500)
            .send({ message: error.message, error: "Internal Server Error" });
        }
      }
    }
  );
}
