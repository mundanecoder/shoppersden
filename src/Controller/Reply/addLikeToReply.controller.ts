import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { addLikeToReplyService } from "../../Services/Reply/addLIkeToReply.service";
import { ObjectId } from "mongodb";
import {
  NotFoundResponseSchema,
  ServerErrorResponseSchema,
  UnAuthorizedResponseSchema,
} from "../../Schemas/error.schema";

interface LikeReplyRequest extends FastifyRequest {
  Params: {
    replyId: string;
  };
}

export default async function addLikeToReply(fastify: FastifyInstance) {
  fastify.patch<LikeReplyRequest>(
    "/like/:replyId",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            replyId: { type: "string" },
          },
          required: ["replyId"],
        },
        response: {
          "500": ServerErrorResponseSchema,
          "401": UnAuthorizedResponseSchema,
          "404": NotFoundResponseSchema,
        },
        tags: ["reply"],
      },
    },
    async (request, reply) => {
      const { replyId } = request.params;
      const userData = request.user;

      if (!userData || !userData._MongoId) {
        return reply.status(401).send({ message: "Unauthorized" });
      }

      try {
        const result = await addLikeToReplyService({
          replyId,
          userId: userData._MongoId,
        });
        reply.status(200).send(result);
      } catch (error: any) {
        if (error.message === "Invalid replyId") {
          reply.status(400).send({ message: error.message });
        } else if (error.message === "Reply not found") {
          reply.status(404).send({ message: error.message });
        } else {
          console.error("Error liking reply:", error);
          reply.status(500).send({ message: "Internal Server Error" });
        }
      }
    }
  );
}
