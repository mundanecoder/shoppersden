import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
// import {
//   AddCommentRequestSchema,
//   CreateCommentResponseSchema,
// } from "../../Schemas/comments/comments.schema";

import {
  NotFoundResponseSchema,
  ServerErrorResponseSchema,
  UnAuthorizedResponseSchema,
} from "../../Schemas/error.schema";
import { addCommentToPostService } from "../../Services/comments/addPostcomment.service";

interface AddCommentRequest extends FastifyRequest {
  params: { postId: string };
  body: {
    content: string;
    media?: {
      url?: string;
      format?: string;
      size?: number;
    };
  };
}

export default async function addCommentRoute(fastify: FastifyInstance) {
  fastify.post<{
    Params: { postId: string };
    Body: {
      content: string;
      media?: { url?: string; format?: string; size?: number };
    };
  }>(
    "/:postId",
    {
      schema: {
        // body: AddCommentRequestSchema,
        response: {
          // 201: CreateCommentResponseSchema,
          401: UnAuthorizedResponseSchema,
          404: NotFoundResponseSchema,
          500: ServerErrorResponseSchema,
        },
        tags: ["comment"],
      },
    },
    async (request: AddCommentRequest, reply: FastifyReply) => {
      const { postId } = request.params;
      const { content, media } = request.body;

      console.log(media, content);

      console.log(postId, "postID");
      const userData = request.user;

      try {
        const result = await addCommentToPostService({
          postId: postId,
          userId: userData?._MongoId,
          content,
          media,
        });

        reply.status(201).send({ success: true, comment: result });
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
