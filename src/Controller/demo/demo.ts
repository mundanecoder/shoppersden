import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export function DemoController(fastify: FastifyInstance) {
  fastify.get(
    "/",
    {
      schema: {},
    },
    async (req: FastifyRequest, res: FastifyReply) => {
      const userdata = req.user;

      return res.status(200).send({ message: "success", data: userdata });
    }
  );
}
