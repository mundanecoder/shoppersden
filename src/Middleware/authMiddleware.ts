import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { createClerkClient, getAuth, Token } from "@clerk/fastify";
import { UserResource } from "@clerk/types";
import UserDB from "../Models/UserModel";
import { ObjectId } from "@fastify/mongodb";

const clerkOptions = {
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY!,
  secretKey: process.env.CLERK_SECRET_KEY!,
};

export interface IUserMongoId {
  _MongoId: ObjectId;
}

export type ExtendedUserResource = UserResource & IUserMongoId;

declare module "fastify" {
  interface FastifyRequest {
    user?: ExtendedUserResource;
  }
}

const clerkClient = createClerkClient(clerkOptions);

const authMiddleware = (fastify: FastifyInstance) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const token = request.headers.authorization?.split(" ")[1];

      console.log(token ? token : "token from header");

      const { userId } = getAuth(request);

      console.log(userId, "userId");

      if (!userId) {
        return reply
          .code(401)
          .send({ success: false, message: "Unauthorized: Missing user ID" });
      }

      const user = (await clerkClient.users.getUser(
        userId
      )) as unknown as ExtendedUserResource;

      if (!user) {
        return reply.code(401).send({
          success: false,
          message: "Unauthorized",
        });
      }

      console.log("User authenticated successfully");

      const userExist = await UserDB.findOne({
        email: user.emailAddresses[0].emailAddress,
      });

      if (user && userExist) {
        request.user = {
          ...user,
          _MongoId: userExist._id as ObjectId,
        };
      } else {
        request.user = user;
      }
    } catch (error) {
      console.error("Error in auth middleware:", error);
      return reply.code(500).send({ error: "Server error" });
    }
  };
};

export default authMiddleware;
