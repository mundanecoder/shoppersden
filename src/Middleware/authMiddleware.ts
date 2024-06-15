import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { createClerkClient, getAuth } from "@clerk/fastify";

const clerkOptions = {
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY!,
  secretKey: process.env.CLERK_SECRET_KEY!,
};

const clerkClient = createClerkClient(clerkOptions);

declare module "fastify" {
  interface FastifyRequest {
    user?: {}; 
  }
}

const authMiddleware = (fastify: FastifyInstance) => {
  fastify.addHook("preHandler", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { userId } = getAuth(request);

      if (!userId) {
        return reply.code(401).send({ error: "Unauthorized: Missing user ID" });
      }

      const user = await clerkClient.users.getUser(userId);

      if (user) {
        console.log("User authenticated successfully");
        request.user = user; // Attach user to the request
      }
    } catch (error) {
      console.error("Error in auth middleware:", error);
      return reply.code(500).send({ error: "Server error" });
    }
  });
};

export default authMiddleware;
