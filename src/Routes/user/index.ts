import { FastifyPluginAsync } from "fastify";
import { createUserRoute, getUserRoute } from "../../Controller/user/index";
import authMiddleware from "../../Middleware/authMiddleware";

const Demo: FastifyPluginAsync = async function (fastify, opts) {
  fastify.addHook("preHandler", authMiddleware(fastify));
  createUserRoute(fastify);
  getUserRoute(fastify);
};

export default Demo;
