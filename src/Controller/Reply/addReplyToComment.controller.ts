import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
// import {
//   AddReplyRequestSchema,
//   AddReplyRequestType,
//   AddReplyResponseSchema,
//   AddReplySchema,
// } from "../../Schemas/reply/reply.schema";

import {
  NotFoundResponseSchema,
  ServerErrorResponseSchema,
  UnAuthorizedResponseSchema,
} from "../../schemas/error.schema";
import { addReplyToCommentService } from "../../services/Reply/addReplyTocomments.service";

interface AddReplyRequest extends FastifyRequest {
  params: { commentId: string };
  body: {
    content: string;
    media?: {
      url?: string;
      format?: string;
      size?: number;
    };
  };
}

export default async function addReplyRoute(fastify: FastifyInstance) {
  fastify.post<{
    Params: { commentId: string };
    Body: {
      content: string;
      media?: { url?: string; format?: string; size?: number };
    };
  }>(
    "/:commentId",
    {
      schema: {
        // body: AddReplySchema,
        response: {
          // 201: AddReplyResponseSchema,
          401: UnAuthorizedResponseSchema,
          404: NotFoundResponseSchema,
          500: ServerErrorResponseSchema,
        },
        description: "add reply to a  post ",
        tags: ["reply"],
      },
    },
    async (request: AddReplyRequest, reply: FastifyReply) => {
      const { commentId } = request.params;
      const { content, media } = request.body;
      const userData = request.user;

      try {
        const result = await addReplyToCommentService({
          commentId: commentId,
          userId: userData?._MongoId,
          content,
          media,
        });
        reply.status(201).send({ success: true, reply: result });
      } catch (error: any) {
        if (error.message === "Invalid replyId") {
          reply.status(400).send({ message: error.message });
        } else if (error.message === "Reply not found") {
          reply.status(404).send({ message: error.message });
        } else {
          console.error("Error liking reply:", error);
          reply.status(500).send({ message: "Internal Server Error" });
        }
      }
    }
  );
}
