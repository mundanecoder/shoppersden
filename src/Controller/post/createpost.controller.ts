import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { handleCreateNewPost } from "../../Services/post/createNewPost.service";
import {
  CreatePostRequestSchema,
  CreatePostResponseSchema,
} from "../../Schemas/post/post.schema";

import { ServerErrorResponseSchema } from "../../Schemas/error.schema";

export default async function createNewPost(fastify: FastifyInstance) {
  fastify.post(
    "/",
    {
      schema: {
        body: CreatePostRequestSchema,
        response: {
          201: CreatePostResponseSchema,
          500: ServerErrorResponseSchema,
        },
      },
    },
    async (req: FastifyRequest, rep: FastifyReply) => {
      try {
        const result = await handleCreateNewPost(req);
        rep.status(201).send(result);
      } catch (error) {
        console.error("Error creating post:", error);
        rep.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
}
