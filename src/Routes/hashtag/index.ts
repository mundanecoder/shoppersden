import { FastifyPluginAsync } from "fastify";
import authMiddleware from "../../middleware/authMiddleware";
import { CreateHashtag, ListHashtags } from "../../controller/hashtag";

const Hashtag: FastifyPluginAsync = async function (fastify, opts) {
  fastify.addHook("preHandler", authMiddleware(fastify));
  CreateHashtag(fastify);
  ListHashtags(fastify);
};

export default Hashtag;
