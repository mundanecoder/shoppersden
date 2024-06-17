import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { createClerkClient, getAuth } from "@clerk/fastify";
import { UserResource } from "@clerk/types";

const clerkOptions = {
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY!,
  secretKey: process.env.CLERK_SECRET_KEY!,
};

declare module "fastify" {
  interface FastifyRequest {
    user?: UserResource;
  }
}

const clerkClient = createClerkClient(clerkOptions);

const authMiddleware = (fastify: FastifyInstance) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { userId } = getAuth(request);

      if (!userId) {
        return reply
          .code(401)
          .send({ success: false, message: "Unauthorized: Missing user ID" });
      }

      const user = (await clerkClient.users.getUser(
        userId
      )) as unknown as UserResource;

      if (user) {
        console.log("User authenticated successfully");

        request.user = user;
      } else {
        return reply.code(401).send({
          success: false,
          message: "unauthorized",
        });
      }
    } catch (error) {
      console.error("Error in auth middleware:", error);
      return reply.code(500).send({ error: "Server error" });
    }
  };
};

export default authMiddleware;
