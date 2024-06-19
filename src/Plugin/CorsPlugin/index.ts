import { FastifyInstance, FastifyPluginOptions } from "fastify";
import fastifyCors from "@fastify/cors";

interface CorsPluginOptions extends FastifyPluginOptions {
  origin?: string | string[];
  methods?: string[];
  allowedHeaders?: string[];
  exposedHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
  preflightContinue?: boolean;
  optionsSuccessStatus?: number;
}

export function corsPlugin(
  fastify: FastifyInstance,
  opts: CorsPluginOptions,
  next: (err?: Error) => void
) {
  const {
    origin = ["http://localhost:5173"], // Adjust to your frontend origin
    methods = ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders = ["Content-Type", "Authorization"],
    exposedHeaders = ["Content-Length", "ETag"],
    credentials = true,
    maxAge = 86400,
    preflightContinue = false,
    optionsSuccessStatus = 204,
  } = opts;

  fastify.register(fastifyCors, {
    origin,
    methods,
    allowedHeaders,
    exposedHeaders,
    credentials,
    maxAge,
    preflightContinue,
    optionsSuccessStatus,
  });

  next();
}
