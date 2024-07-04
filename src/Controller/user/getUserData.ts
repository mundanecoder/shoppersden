import {
  NotFoundResponseSchema,
  ServerErrorResponseSchema,
  UnAuthorizedResponseSchema,
} from "../../Schemas/error.schema";
// import { UserResource } from "@clerk/types";
import { ExtendedUserResource } from "../../Middleware/authMiddleware";

import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { getUserInfo } from "../../Services/user/getUserData.service"; // Import the getUserInfo function

export default function getUserRoute(fastify: FastifyInstance) {
  fastify.get(
    "/",
    {
      schema: {
        response: {
          "401": UnAuthorizedResponseSchema,
          "404": NotFoundResponseSchema,
          "500": ServerErrorResponseSchema,
        },
        tags: ["user"],
      },
    },
    async (req: FastifyRequest, rep: FastifyReply) => {
      const userData = req.user;

      try {
        const result = await getUserInfo({
          email: userData?.emailAddresses[0].emailAddress,
        });

        if (result.success) {
          return rep.status(200).send({
            message: result.message,
            user: result.user,
          });
        } else {
          return rep.status(404).send({
            message: result.message,
          });
        }
      } catch (error) {
        console.error("Error in getUserRoute:", error);
        return rep.status(500).send({
          error: "Internal Server Error",
          message: "An error occurred while retrieving the user information",
        });
      }
    }
  );
}
