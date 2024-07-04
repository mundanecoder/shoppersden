import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { handleCreateNewPost } from "../../services/post/createNewPost.service";
import {
  CreatePostRequestSchema,
  CreatePostResponseSchema,
} from "../../schemas/post/post.schema";

import {
  NotFoundResponseSchema,
  ServerErrorResponseSchema,
  UnAuthorizedResponseSchema,
} from "../../schemas/error.schema";

export default async function createNewPost(fastify: FastifyInstance) {
  fastify.post(
    "/",
    {
      schema: {
        body: CreatePostRequestSchema,
        response: {
          201: CreatePostResponseSchema,
          500: ServerErrorResponseSchema,
          401: UnAuthorizedResponseSchema,
          404: NotFoundResponseSchema,
        },
        description: "create a new post ",
        tags: ["post"],
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
