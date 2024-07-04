import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  NotFoundResponseSchema,
  ServerErrorResponseSchema,
  UnAuthorizedResponseSchema,
} from "../../schemas/error.schema";
import { deleteSoftPostService } from "../../services/post/deletePost.Soft.service";

export default async function deletePostController(fastify: FastifyInstance) {
  fastify.delete<{ Params: { postId: string } }>(
    "/:postId",
    {
      schema: {
        response: {
          "401": UnAuthorizedResponseSchema,
          "404": NotFoundResponseSchema,
          "500": ServerErrorResponseSchema,
        },
        tags: ["post"],
      },
    },
    async (request, reply) => {
      const { postId } = request.params;

      try {
        const success = await deleteSoftPostService(postId);

        if (!success) {
          return reply.status(404).send({ error: "Post not found" });
        }

        return reply.send({
          success: true,
          message: "Post deleted successfully",
        });
      } catch (error) {
        console.error("Error deleting post:", error);
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
}
