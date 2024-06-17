import Fastify from "fastify";
import { join } from "path";
import * as dotenv from "dotenv";
import connectToDb from "./Database/db";
import { registerPlugins } from "./Utility/pluginMapper";
import { corsPlugin } from "./Plugin/CorsPlugin";
import fastifySensible from "@fastify/sensible";
import { clerkPlugin } from "@clerk/fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { autoLoadPlugin } from "./Plugin/AutoLoadPlugin";

dotenv.config();

const clerkOptions = {
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY,
};

// Plugin configurations
const plugins = [
  {
    plugin: corsPlugin,
    options: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
      exposedHeaders: ["Content-Length", "ETag"],
      credentials: true,
      maxAge: 86400,
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
  },
  {
    plugin: autoLoadPlugin,
    options: {
      dir: join(__dirname, "./routes"),
    },
  },
];

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

const environment: string = process.env.NODE_ENV || "development";

const fastify = Fastify({
  logger: envToLogger[environment as keyof typeof envToLogger] ?? true,
});

fastify.register(fastifySensible);
fastify.register(clerkPlugin, clerkOptions);

fastify.register(fastifySwagger);
fastify.register(fastifySwaggerUi, {
  routePrefix: "/api/v1/docs",
  uiConfig: {
    docExpansion: "full",
    deepLinking: false,
  },
  uiHooks: {
    onRequest: function (_request, _reply, next) {
      next();
    },
    preHandler: function (_request, _reply, next) {
      next();
    },
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject, _request, _reply) => {
    return {
      ...swaggerObject,
      info: {
        title: "ShoppersDen API Documentation",
      },
    };
  },
  transformSpecificationClone: true,
});

/**
 * Register plugins through this utility function
 * Pass the fastify instance and the plugins array, your plugin should be imported to this file and included in the array at the top of the file
 */
registerPlugins(fastify, plugins);

const startServer = async () => {
  try {
    await fastify.ready();
    fastify.listen({ port: 8000 }, (err, address) => {
      if (err) {
        fastify.log.error(err);
        process.exit(1);
      }
      fastify.log.info(`Server listening on ${address}`);
    });
  } catch (error) {
    fastify.log.error(`Error starting server: ${error}`);
    process.exit(1);
  }
};

const runApp = async () => {
  try {
    await connectToDb();
    await startServer();
  } catch (error) {
    fastify.log.error(`Error starting application: ${error}`);
    process.exit(1);
  }
};

runApp();
