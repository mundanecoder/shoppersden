import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { NotFoundResponseSchema, ServerErrorResponseSchema, UnAuthorizedResponseSchema } from "../../Schemas/error.schema";
import { mutualFollowers } from "../../Services/follow";

const MutualFollowersRequestSchema = {
  type: "object",
  required: ["userId1", "userId2"],
  properties: {
    userId1: { type: "string" },
    userId2: { type: "string" }
  }
};

const MutualFollowersResponseSchema = {
  type: "object",
  properties: {
    mutualFollowers: {
      type: "array",
      items: { type: "string" }
    }
  }
};

export function MutualFollowers(fastify: FastifyInstance) {
  fastify.post(
    "/mutual-followers",
    {
      schema: {
        body: MutualFollowersRequestSchema,
        response: {
          "200": MutualFollowersResponseSchema,
          "401": UnAuthorizedResponseSchema,
          "404": NotFoundResponseSchema,
          "500": ServerErrorResponseSchema,
        },
      },
    },
    async (req: FastifyRequest, res: FastifyReply) => {
      const { userId1, userId2 } = req.body as { userId1: string, userId2: string };
      const result = await mutualFollowers(userId1, userId2);

      if (result.success) {
        return res.status(200).send({ mutualFollowers: result.mutualFollowers });
      } else {
        return res.status(500).send({ message: result.message });
      }
    }
  );
}
