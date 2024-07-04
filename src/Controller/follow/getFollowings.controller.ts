import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  NotFoundResponseSchema,
  ServerErrorResponseSchema,
  UnAuthorizedResponseSchema,
} from "../../Schemas/error.schema";
import { getFollowings } from "../../Services/follow";

const GetFollowingsResponseSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      followingId: { type: "string" },
    },
  },
};

export function GetFollowings(fastify: FastifyInstance) {
  fastify.get(
    "/followings/:userId/:entityType",
    {
      schema: {
        response: {
          "200": GetFollowingsResponseSchema,
          "401": UnAuthorizedResponseSchema,
          "404": NotFoundResponseSchema,
          "500": ServerErrorResponseSchema,
        },
      },
    },
    async (req: FastifyRequest, res: FastifyReply) => {
      const { userId, entityType } = req.params as {
        userId: string;
        entityType: "user" | "shop";
      };

      try {
        const followings = await getFollowings(userId, entityType);
        return res.status(200).send(followings);
      } catch (error) {
        return res
          .status(500)
          .send({ message: "An error occurred while retrieving followings." });
      }
    }
  );
}
