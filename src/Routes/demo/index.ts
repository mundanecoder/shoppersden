import { FastifyPluginAsync } from "fastify";
import { DemoController } from "../../controller/demo/index";
import authMiddleware from "../../middleware/authMiddleware";

const Demo: FastifyPluginAsync = async function (fastify, opts) {
  // fastify.addHook("preHandler", authMiddleware(fastify));
  DemoController(fastify);
};

export default Demo;
