import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  NotFoundResponseSchema,
  ServerErrorResponseSchema,
  UnAuthorizedResponseSchema,
} from "../../schemas/error.schema";
import { unfollowEntity } from "../../services/follow";

const UnfollowEntitySchema = {
  type: "object",
  required: ["followerId", "followingId", "followType"],
  properties: {
    followerId: { type: "string" },
    followingId: { type: "string" },
    followType: { type: "string", enum: ["user", "shop"] },
  },
};

const UnfollowEntityResponseSchema = {
  type: "object",
  properties: {
    message: { type: "string" },
  },
};

export function UnfollowEntity(fastify: FastifyInstance) {
  fastify.post(
    "/unfollow",
    {
      schema: {
        body: UnfollowEntitySchema,
        response: {
          "200": UnfollowEntityResponseSchema,
          "401": UnAuthorizedResponseSchema,
          "404": NotFoundResponseSchema,
          "500": ServerErrorResponseSchema,
        },
      },
    },
    async (req: FastifyRequest, res: FastifyReply) => {
      const { followerId, followingId, followType } = req.body as {
        followerId: string;
        followingId: string;
        followType: "user" | "shop";
      };
      const result = await unfollowEntity(followerId, followingId, followType);

      if (result) {
        return res
          .status(200)
          .send({ message: "Successfully unfollowed the entity." });
      } else {
        return res
          .status(404)
          .send({ message: "Follow relationship not found." });
      }
    }
  );
}
