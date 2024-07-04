import { FastifyPluginAsync } from "fastify";
import {
  deleteCommentController,
  editCommentToPost,
  addCommentRoute,
  addLIkeToComment,
  getCommentsByUser,
} from "../../controller/comments";

import authMiddleware from "../../middleware/authMiddleware";

const Post: FastifyPluginAsync = async function (fastify, opts) {
  fastify.addHook("preHandler", authMiddleware(fastify));
  deleteCommentController(fastify);
  editCommentToPost(fastify);
  addCommentRoute(fastify);
  addLIkeToComment(fastify);
  getCommentsByUser(fastify);
};

export default Post;
