import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export function DemoController(fastify: FastifyInstance) {
  fastify.get(
    "/",
    {
      schema: {
        tags: ["health"],
      },
    },
    async (req: FastifyRequest, res: FastifyReply) => {
      const userdata = req.user;
      return res
        .status(200)
        .send({ message: "success", health: "working fine" });
    }
  );
}
