import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { createClerkClient, getAuth } from "@clerk/fastify";

const clerkOptions = {
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY,
};

const clerkClient = createClerkClient(clerkOptions);

const authMiddleware = (fastify: FastifyInstance) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { userId } = getAuth(request);
      //   console.log(request.headers.authorization);
      console.log("inside prehandler");

      if (!userId) {
        return reply.code(401).send({ error: "Unauthorized: Missing user ID" });
      }

      const user = await clerkClient.users.getUser(userId);

      if (user) {
        console.log("success");
      }
      request.user = user;
    } catch (error) {
      console.log(error);
      return reply.code(500).send({ error: "server error" });
    }
  };
};

export default authMiddleware;
