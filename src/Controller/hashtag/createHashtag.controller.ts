import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { NotFoundResponseSchema, ServerErrorResponseSchema, UnAuthorizedResponseSchema } from "../../Schemas/error.schema";
import { createHashtagService } from "../../Services/hashtag";

// Request body schema for hashtag incoming payload
const CreateHashtagSchema = {
  type: "object",
  required: ["label"],
  properties: {
    label: { type: "string" }
  }
};

// Response schema for hashtag successful creation
const CreateHashtagResponseSchema = {
  type: "object",
  properties: {
    message: { type: "string" },
    data: { 
      type: "object",
      properties: {
        label: { type: "string" }
      }
    }
  }
};

export function CreateHashtag(fastify: FastifyInstance) {
  fastify.post(
    "/create",
    {
      schema: {
        body: CreateHashtagSchema,
        response: {
          "200": CreateHashtagResponseSchema,
          "401": UnAuthorizedResponseSchema,
          "404": NotFoundResponseSchema,
          "500": ServerErrorResponseSchema,
        },
      },
    },
    async (req: FastifyRequest, res: FastifyReply) => {
      const hashtagData: { label: string } = req.body as { label: string };
      const result = await createHashtagService(hashtagData);

      if (result.success) {
        const response = {
          message: result.message,
          data: hashtagData
        };
        return res.status(200).send(response);
      } else {
        return res.status(500).send({ message: result.message });
      }
    }
  );
}
