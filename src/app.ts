import Fastify, { type FastifyServerOptions } from 'fastify';

export function buildApp(opcoes: FastifyServerOptions = {}) {
  const app = Fastify(opcoes);

  return app;
}