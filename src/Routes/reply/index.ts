import { FastifyPluginAsync } from "fastify";
import {
  addReplyRoute,
  deleteReplyController,
  editReplyToComment,
  addLikeToReply,
} from "../../controller/Reply";
import authMiddleware from "../../middleware/authMiddleware";

const Demo: FastifyPluginAsync = async function (fastify, opts) {
  fastify.addHook("preHandler", authMiddleware(fastify));
  addReplyRoute(fastify);
  deleteReplyController(fastify);
  editReplyToComment(fastify);
  addLikeToReply(fastify);
};

export default Demo;
