import { FastifyInstance, FastifyPluginOptions } from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";

interface SwaggerPluginOptions extends FastifyPluginOptions {
  routePrefix?: string;
  title?: string;
  docExpansion?: string;
  deepLinking?: boolean;
}

export default function swaggerPlugin(
  fastify: FastifyInstance,
  opts: SwaggerPluginOptions,
  next: (err?: Error) => void
) {
  //  Default override when an options configuration is not provided
  const {
    routePrefix = "api/docs",
    title = "ShoppersDen API docs",
    docExpansion = "full",
    deepLinking = false,
  } = opts;

  fastify.register(fastifySwagger);
  fastify.register(fastifySwaggerUI, {
    routePrefix,
    uiConfig: {
      docExpansion: docExpansion as "full" | "list" | "none",
      deepLinking,
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
          title,
        },
      };
    },
    transformSpecificationClone: true,
  });

  next();
}
