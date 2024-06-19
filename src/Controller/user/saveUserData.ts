import {
  NotFoundResponseSchema,
  ServerErrorResponseSchema,
  UnAuthorizedResponseSchema,
} from "../../Schemas/error.schema";
// import { UserResource } from "@clerk/types";
import { ExtendedUserResource } from "../../Middleware/authMiddleware";

import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { createUser } from "../../Services/user"; // Import the createUser function

export default function createUserRoute(fastify: FastifyInstance) {
  fastify.post(
    "/",
    {
      schema: {
        response: {
          "401": UnAuthorizedResponseSchema,
          "404": NotFoundResponseSchema,
          "500": ServerErrorResponseSchema,
        },
      },
    },
    async (req: FastifyRequest, rep: FastifyReply) => {
      const userData = req.user;

      try {
        const result = await createUser(userData as ExtendedUserResource);

        if (result.success) {
          return rep.status(201).send({
            message: result.message,
            email: userData?.emailAddresses[0].emailAddress,
          });
        } else {
          return rep.status(200).send({
            message: result.message,
            email: userData?.emailAddresses[0].emailAddress,
          });
        }
      } catch (error) {
        console.error("Error in createUserRoute:", error);
        return rep.status(500).send({
          error: "Internal Server Error",
          message: "An error occurred while creating the user",
        });
      }
    }
  );
}
