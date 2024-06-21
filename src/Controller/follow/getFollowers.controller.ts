import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { NotFoundResponseSchema, ServerErrorResponseSchema, UnAuthorizedResponseSchema } from "../../Schemas/error.schema";
import { getFollowers } from "../../Services/follow";

const GetFollowersResponseSchema = {
  type: "object",
  properties: {
    success: { type: "boolean" },
    message: { type: "string" },
    followers: {
      type: "array",
      items: {
        type: "object",
        properties: {
          _id: { type: "string" },
          followerId: { type: "string" }
        },
        required: ["_id", "followerId"]
      }
    }
  },
  required: ["success", "message", "followers"]
};
  
  export function GetFollowers(fastify: FastifyInstance) {
    fastify.get(
      "/followers/:entityId/:entityType",
      {
        schema: {
          response: {
            "200": GetFollowersResponseSchema,
            "401": UnAuthorizedResponseSchema,
            "404": NotFoundResponseSchema,
            "500": ServerErrorResponseSchema,
          },
        },
      },
      async (req: FastifyRequest, res: FastifyReply) => {
        const { entityId, entityType } = req.params as { entityId: string, entityType: 'user' | 'shop' };
  
        try {
          const followers = await getFollowers(entityId, entityType);
          return res.status(200).send(followers);
        } catch (error) {
          return res.status(500).send({ message: 'An error occurred while retrieving followers.' });
        }
      }
    );
  }
  