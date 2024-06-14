import Fastify from "fastify";
import connectToDb from "./Database/db";
import autoLoad from "@fastify/autoload";
import fastifyCors from "@fastify/cors";
import { join } from "path";
// import { clerkPlugin } from "@clerk/fastify";
import * as dotenv from "dotenv";

dotenv.config();
// const clerkOptions = {
//   publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
//   secretKey: process.env.CLERK_SECRET_KEY,
// };

const envToLogger = {
  development: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
  production: true,
  test: false,
};

const environment: string = "development";

const fastify = Fastify({
  logger: envToLogger[environment as keyof typeof envToLogger] ?? true,
});

// fastify.register(clerkPlugin, clerkOptions);

fastify.register(fastifyCors, {
  allowedHeaders: "*",
  methods: "*",
});

fastify.register(autoLoad, {
  dir: join(__dirname, "./routes"),
});

connectToDb();

fastify.get("/ping", async (request, reply) => {
  return reply.send({ message: "ping" });
});

const startServer = async () => {
  try {
    await fastify.ready();
    await fastify.listen({ port: 8000 });

    console.log("Server listening on port 8000");
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

startServer();
