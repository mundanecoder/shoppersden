import { FastifyPluginAsync } from "fastify";
import authMiddleware from "../../middleware/authMiddleware";
import {
  CountFollowers,
  CountFollowings,
  FollowEntity,
  GetFollowers,
  GetFollowings,
  UnfollowEntity,
  MutualFollowers,
} from "../../controller/follow";

const Hashtag: FastifyPluginAsync = async function (fastify, opts) {
  fastify.addHook("preHandler", authMiddleware(fastify));
  FollowEntity(fastify);
  UnfollowEntity(fastify);
  GetFollowers(fastify);
  GetFollowings(fastify);
  CountFollowers(fastify);
  CountFollowings(fastify);
  MutualFollowers(fastify);
};

export default Hashtag;
