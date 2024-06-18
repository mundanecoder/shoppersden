import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import fastifyCors from '@fastify/cors';

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

export function corsPlugin(fastify: FastifyInstance, opts: CorsPluginOptions, next: (err?: Error) => void) {
  const {
    origin = '*',
    methods = ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders,
    exposedHeaders,
    credentials,
    maxAge,
    preflightContinue,
    optionsSuccessStatus,
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
