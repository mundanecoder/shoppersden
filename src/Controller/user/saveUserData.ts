import {
  NotFoundResponseSchema,
  ServerErrorResponseSchema,
  UnAuthorizedResponseSchema,
} from "../../Schemas/error.schema";

import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
// import { Type, Static } from "@sinclair/typebox";
import UserDB from "../../Models/UserModel";

// const BodySchema = Type.Strict(
//   Type.Object({
//     name: Type.String({ minLength: 1 }),
//     email: Type.String({ format: "email" }),
//     age: Type.String({ minLength: 1 }),
//   })
// );

// type BodyType = Static<typeof BodySchema>;

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

      console.log(userData?.emailAddresses);

      try {
        const userExist = await UserDB.findOne({
          email: userData?.emailAddresses[0].emailAddress,
        });

        if (!userExist) {
          let newUser = new UserDB({
            firstname: userData?.firstName,
            lastName: userData?.lastName,
            fullName: userData?.fullName,
            phoneNumbers: userData?.phoneNumbers ? userData?.phoneNumbers : "",
            email: userData?.emailAddresses[0].emailAddress,
            clerkId: userData?.id,
          });

          await newUser.save();

          return rep.status(200).send({
            message: "User created successfully",
            email: userData?.emailAddresses[0].emailAddress,
          });
        }
      } catch (error) {
        console.error(error);
        rep.status(500).send({ message: "Internal Server Error" });
      }
    }
  );
}
