import { FastifyPluginAsync } from "fastify";
import {
  createNewPost,
  getPostsByUser,
  deletePostController,
  editPostController,
  addLIkeToPost,
} from "../../controller/post/index";
import authMiddleware from "../../middleware/authMiddleware";

const Post: FastifyPluginAsync = async function (fastify, opts) {
  fastify.addHook("preHandler", authMiddleware(fastify));
  createNewPost(fastify);
  getPostsByUser(fastify);
  deletePostController(fastify);
  editPostController(fastify);
  addLIkeToPost(fastify);
};

export default Post;
