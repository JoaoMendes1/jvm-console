import { buildApp } from './app.ts';

// 8080 é a porta interna do container, a que o Caddy alcança pela rede do compose.
const porta = Number(process.env.PORT ?? 8080);

const app = buildApp({ logger: true });

try {
  // 0.0.0.0 escuta em todas as interfaces. Dentro do container é obrigatório:
  // com 127.0.0.1, o Caddy, que está em outro container, não alcançaria o app.
  await app.listen({ port: porta, host: '0.0.0.0' });
} catch (erro) {
  app.log.error(erro);
  process.exit(1);
}