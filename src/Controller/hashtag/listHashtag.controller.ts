import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { NotFoundResponseSchema, ServerErrorResponseSchema, UnAuthorizedResponseSchema } from "../../Schemas/error.schema";
import { listHashtagsService } from "../../Services/hashtag";

// Response schema for hashtag listing
const ListHashtagsResponseSchema = {
  type: "object",
  properties: {
    message: { type: "string" },
    data: {
      type: "array",
      items: {
        type: "object",
        properties: {
          label: { type: "string" },
        }
      }
    }
  }
};

export function ListHashtags(fastify: FastifyInstance) {
  fastify.get(
    "/list",
    {
      schema: {
        response: {
          "200": ListHashtagsResponseSchema,
          "401": UnAuthorizedResponseSchema,
          "404": NotFoundResponseSchema,
          "500": ServerErrorResponseSchema,
        },
      },
    },
    async (req: FastifyRequest, res: FastifyReply) => {
      const result = await listHashtagsService();

      if (result.success) {
        const response = {
          message: "Hashtags fetched successfully",
          data: result.data
        };
        return res.status(200).send(response);
      } else {
        return res.status(500).send({ message: result.message });
      }
    }
  );
}
