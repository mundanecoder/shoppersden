import Fastify, { FastifyPluginCallback } from "fastify";
import { join } from "path";
import * as dotenv from "dotenv";
import connectToDb from "./Database/db";
import swaggerPlugin from "./Plugin/SwaggerPlugin";
import { registerPlugins } from "./Utility/pluginMapper";
import { corsPlugin } from "./Plugin/CorsPlugin";
import { autoLoadPlugin } from "./Plugin/AutoLoadPlugin";

dotenv.config();

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
      dir: join(__dirname, '/routes'), 
    },
  },
  {
    plugin: swaggerPlugin,
    options: {
      routePrefix: "api/v1/docs",
      title: "ShoppersDen API Documentation",
      docExpansion: "list",
      deepLinking: true,
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

const startServer = async () => {
  try {

    /**
 * Utility function to register plugin with fastify
 * Make sure the plugins are ordered properly
 */
    await registerPlugins(fastify, plugins);

    await fastify.ready();
    fastify.server.listen(8000);
    fastify.log.info(`Server listening on port 8000`);
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
