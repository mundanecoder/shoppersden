import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  NotFoundResponseSchema,
  ServerErrorResponseSchema,
  UnAuthorizedResponseSchema,
} from "../../schemas/error.schema";
import { followEntity } from "../../services/follow";

const FollowEntitySchema = {
  type: "object",
  required: ["followerId", "followingId", "followType"],
  properties: {
    followerId: { type: "string" },
    followingId: { type: "string" },
    followType: { type: "string", enum: ["user", "shop"] },
  },
};

const FollowEntityResponseSchema = {
  type: "object",
  properties: {
    message: { type: "string" },
  },
};

export function FollowEntity(fastify: FastifyInstance) {
  fastify.post(
    "/",
    {
      schema: {
        body: FollowEntitySchema,
        response: {
          "200": FollowEntityResponseSchema,
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
      const result = await followEntity(followerId, followingId, followType);

      if (result.success) {
        const response = { message: result.message };
        return res.status(200).send(response);
      } else {
        return res.status(500).send({ message: result.message });
      }
    }
  );
}
