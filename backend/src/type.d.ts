import "@fastify/fastify";

declare module "fastify" {
  interface FastifyRequest {
    user?: {
      // to be added according to needs of tha application
    };
  }
}
