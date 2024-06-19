import { FastifyPluginAsync } from "fastify";
import {
  createNewPost,
  getPostsByUser,
  deletePostController,
  editPostController,
} from "../../Controller/post/index";
import authMiddleware from "../../Middleware/authMiddleware";

const Post: FastifyPluginAsync = async function (fastify, opts) {
  fastify.addHook("preHandler", authMiddleware(fastify));
  createNewPost(fastify);
  getPostsByUser(fastify);
  deletePostController(fastify);
  editPostController(fastify);
};

export default Post;
