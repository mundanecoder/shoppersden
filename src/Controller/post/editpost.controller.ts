import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { editPostService } from "../../Services/post/editpost.service";
import {
  NotFoundResponseSchema,
  ServerErrorResponseSchema,
  UnAuthorizedResponseSchema,
} from "../../Schemas/error.schema";

interface EditPostParams {
  content: string;
  media?: {
    images?: string[];
    videos?: string[];
  };
}

export default async function editPostController(fastify: FastifyInstance) {
  fastify.put<{ Params: { postId: string }; Body: EditPostParams }>(
    "/:postId",
    {
      schema: {
        response: {
          "401": UnAuthorizedResponseSchema,
          "404": NotFoundResponseSchema,
          "500": ServerErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { postId } = request.params;
      const { content, media } = request.body;

      try {
        const updatedPost = await editPostService({ postId, content, media });

        if (!updatedPost) {
          return reply.status(404).send({ error: "Post not found" });
        }

        return reply.send({ success: true, post: updatedPost });
      } catch (error) {
        console.error("Error editing post:", error);
        return reply.status(500).send({
          error: "Internal Server Error",
          message: "An error occurred while creating the user",
        });
      }
    }
  );
}
