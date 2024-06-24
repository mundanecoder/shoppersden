import { FastifyPluginAsync } from "fastify";
import {
  deleteCommentController,
  editCommentToPost,
  addCommentRoute,
  addLIkeToComment,
  getCommentsByUser,
} from "../../Controller/comments";

import authMiddleware from "../../Middleware/authMiddleware";

const Post: FastifyPluginAsync = async function (fastify, opts) {
  fastify.addHook("preHandler", authMiddleware(fastify));
  deleteCommentController(fastify);
  editCommentToPost(fastify);
  addCommentRoute(fastify);
  addLIkeToComment(fastify);
  getCommentsByUser(fastify);
};

export default Post;
