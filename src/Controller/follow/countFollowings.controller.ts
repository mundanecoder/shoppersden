import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  NotFoundResponseSchema,
  ServerErrorResponseSchema,
  UnAuthorizedResponseSchema,
} from "../../Schemas/error.schema";
import { countFollowings } from "../../Services/follow";

const CountFollowingsResponseSchema = {
  type: "object",
  properties: {
    count: { type: "number" },
  },
};

export function CountFollowings(fastify: FastifyInstance) {
  fastify.get(
    "/followings/count/:userId/:entityType",
    {
      schema: {
        response: {
          "200": CountFollowingsResponseSchema,
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
        const count = await countFollowings(userId, entityType);
        return res.status(200).send({ count });
      } catch (error) {
        return res
          .status(500)
          .send({ message: "An error occurred while counting followings." });
      }
    }
  );
}
