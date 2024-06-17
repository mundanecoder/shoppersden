import { FastifyPluginAsync } from "fastify";
import { createUserRoute } from "../../Controller/user/index";
import authMiddleware from "../../Middleware/authMiddleware";

const Demo: FastifyPluginAsync = async function (fastify, opts) {
  fastify.addHook("preHandler", authMiddleware(fastify));
  createUserRoute(fastify);
};

export default Demo;
