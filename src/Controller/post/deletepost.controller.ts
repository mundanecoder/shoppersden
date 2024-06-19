import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { deletePostService } from "../../Services/post/deletepost.service";

export default async function deletePostController(fastify: FastifyInstance) {
  fastify.delete<{ Params: { postId: string } }>(
    "/:postId",
    async (request, reply) => {
      const { postId } = request.params;

      try {
        const success = await deletePostService(postId);

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
