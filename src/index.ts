import Fastify from 'fastify';
import autoLoad from '@fastify/autoload';
import fastifyCors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import { join } from 'path';
import * as dotenv from 'dotenv';
import connectToDb from './Database/db'; 

dotenv.config();

const envToLogger = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
  production: true,
  test: false,
};

const environment: string = process.env.NODE_ENV || 'development';

const fastify = Fastify({
  logger: envToLogger[environment as keyof typeof envToLogger] ?? true,
});

fastify.register(fastifyCors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

fastify.register(fastifySwagger);
fastify.register(fastifySwaggerUI, {
  routePrefix: 'api/docs',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false
  },
  uiHooks: {
    onRequest: function (request, reply, next) { next() },
    preHandler: function (request, reply, next) { next() }
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject, request, reply) => { return {
    ...swaggerObject,
    info: {
      title: "ShoppersDen API docs"
    },
  } },
  transformSpecificationClone: true
});

fastify.register(autoLoad, {
  dir: join(__dirname, './routes'),
});

const startServer = async () => {
  try {
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
