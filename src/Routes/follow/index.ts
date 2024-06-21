import { FastifyPluginAsync } from "fastify";
import authMiddleware from "../../Middleware/authMiddleware";
import {
  CountFollowers,
  CountFollowings,
  FollowEntity,
  GetFollowers,
  GetFollowings,
  UnfollowEntity,
} from "../../Controller/follow";

const Hashtag: FastifyPluginAsync = async function (fastify, opts) {
  fastify.addHook("preHandler", authMiddleware(fastify));
  FollowEntity(fastify);
  UnfollowEntity(fastify);
  GetFollowers(fastify);
  GetFollowings(fastify);
  CountFollowers(fastify);
  CountFollowings(fastify);
};

export default Hashtag;
