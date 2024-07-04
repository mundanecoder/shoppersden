// EditCommentController.ts

import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  EditCommentRequestSchema,
  EditCommentResponseSchema,
} from "../../schemas/comments/comments.schema";
import {
  NotFoundResponseSchema,
  ServerErrorResponseSchema,
  UnAuthorizedResponseSchema,
} from "../../schemas/error.schema";
import { editCommentService } from "../../services/comments/editComments.service";

interface EditCommentRequest extends FastifyRequest {
  params: { commentId: string };
  body: typeof EditCommentRequestSchema;
}
interface ErrorResponse {
  message: string;
}

export default async function editCommentToPost(fastify: FastifyInstance) {
  fastify.put<{
    Params: { commentId: string };
    Body: typeof EditCommentRequestSchema;
  }>(
    "/:commentId",
    {
      schema: {
        params: { commentId: { type: "string" } },
        body: EditCommentRequestSchema,
        response: {
          200: EditCommentResponseSchema,
          401: UnAuthorizedResponseSchema,
          404: NotFoundResponseSchema,
          500: ServerErrorResponseSchema,
        },
        tags: ["comment"],
      },
    },
    async (request: EditCommentRequest, reply: FastifyReply) => {
      const { commentId } = request.params;
      const { content, media } = request.body;
      const userData = request.user;

      try {
        const result = await editCommentService({
          commentId,
          userId: userData?._MongoId!,
          content,
          media,
        });
        reply.status(200).send({ success: true, comment: result });
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
