import { FastifyPluginAsync } from "fastify";
import {
  addReplyRoute,
  deleteReplyController,
  editReplyToComment,
  addLikeToReply,
} from "../../Controller/Reply";
import authMiddleware from "../../Middleware/authMiddleware";

const Demo: FastifyPluginAsync = async function (fastify, opts) {
  fastify.addHook("preHandler", authMiddleware(fastify));
  addReplyRoute(fastify);
  deleteReplyController(fastify);
  editReplyToComment(fastify);
  addLikeToReply(fastify);
};

export default Demo;
