import { FastifyPluginAsync } from "fastify";
import authMiddleware from "../../Middleware/authMiddleware";
import { CreateHashtag, ListHashtags } from "../../Controller/hashtag";

const Hashtag: FastifyPluginAsync = async function (fastify, opts) {
  fastify.addHook("preHandler", authMiddleware(fastify));
  CreateHashtag(fastify);
  ListHashtags(fastify)
};

export default Hashtag;
