import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { NotFoundResponseSchema, ServerErrorResponseSchema, UnAuthorizedResponseSchema } from "../../Schemas/error.schema";
import { countFollowers } from "../../Services/follow";

const CountFollowersResponseSchema = {
    type: "object",
    properties: {
      count: { type: "number" }
    }
  };
  
  export function CountFollowers(fastify: FastifyInstance) {
    fastify.get(
      "/followers/count/:entityId/:entityType",
      {
        schema: {
          response: {
            "200": CountFollowersResponseSchema,
            "401": UnAuthorizedResponseSchema,
            "404": NotFoundResponseSchema,
            "500": ServerErrorResponseSchema,
          },
        },
      },
      async (req: FastifyRequest, res: FastifyReply) => {
        const { entityId, entityType } = req.params as { entityId: string, entityType: 'user' | 'shop' };
  
        try {
          const count = await countFollowers(entityId, entityType);
          return res.status(200).send({ count });
        } catch (error) {
          return res.status(500).send({ message: 'An error occurred while counting followers.' });
        }
      }
    );
  }
  