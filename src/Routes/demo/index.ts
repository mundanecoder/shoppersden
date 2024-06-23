import { FastifyPluginAsync } from "fastify";
import { DemoController } from "../../Controller/demo/index";
import authMiddleware from "../../Middleware/authMiddleware";

const Demo: FastifyPluginAsync = async function (fastify, opts) {
  // fastify.addHook("preHandler", authMiddleware(fastify));
  DemoController(fastify);
};

export default Demo;
