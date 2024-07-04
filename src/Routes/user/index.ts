import { FastifyPluginAsync } from "fastify";
import { createUserRoute, getUserRoute } from "../../controller/user/index";
import authMiddleware from "../../middleware/authMiddleware";

const Demo: FastifyPluginAsync = async function (fastify, opts) {
  fastify.addHook("preHandler", authMiddleware(fastify));
  createUserRoute(fastify);
  getUserRoute(fastify);
};

export default Demo;
