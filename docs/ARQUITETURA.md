# 🏗️ ARQUITETURA.md — como o JVM Console funciona

> Como o sistema funciona **hoje**, por dentro. Mudou o funcionamento, muda este arquivo
> no mesmo commit. O porquê de cada escolha está no [`DECISIONS.md`](DECISIONS.md).

> 🕐 **Arquitetura planejada.** Nada abaixo existe em código ainda. Os nomes de tabela e
> de rota são a intenção de hoje e podem mudar na implementação.

## Visão geral

```
navegador ──HTTPS──> Caddy ──rede interna──> jvm-console:8080 (Fastify) ──> postgres (container)
                                                    │
                                                    ├──> Gemini (revisão de texto)
                                                    ├──> GitHub (disparo do rebuild do portfólio)
                                                    └──> GitHub e sites (painel, Fase 4)

build do portfólio ──HTTPS + token──> jvm-console:/api/publico/pilulas
```

- **O Caddy é a única porta de entrada.** O container do Console e o do PostgreSQL usam
  `expose`, nunca `ports`.
- **O PostgreSQL não é alcançável de fora**, só pela rede interna do compose.
- **O portfólio nunca chama o Console em tempo de execução**, só no build.
- **Um container só para a aplicação:** o Fastify serve a API em `/api` e os arquivos do
  React gerados pelo Vite em todo o resto. Mesmo endereço, sem CORS.

## Stack

| Peça | O que é |
|---|---|
| Servidor | Node.js, Fastify, TypeScript |
| Validação | Schema por rota no Fastify, e Zod para o que volta do banco |
| Banco | PostgreSQL, acessado com `pg` e SQL escrito à mão |
| Frontend | React com Vite, gerado no build e servido pelo Fastify |
| Markdown na tela | Convertido no navegador e limpo com DOMPurify pela lista fechada |
| Segurança HTTP | Plugins oficiais do Fastify: cabeçalhos, limite de requisições, cookie e sessão |

## Autenticação

- **Dono:** login com Google pelo plugin oficial `@fastify/oauth2`. Depois do login, o
  servidor compara o ID da conta Google com o `OWNER_GOOGLE_ID` do `.env`. Se não for
  igual, não há sessão de dono: a tela oferece entrar como convidado.
- **Convidado:** um botão cria um usuário com prazo de 24 horas e notas de exemplo
  copiadas para ele. Não há senha nem e-mail.
- **Sessão guardada no PostgreSQL** (tabela `sessoes`), referenciada por um cookie
  `HttpOnly`, `Secure` e `SameSite=Lax`. Com a sessão no banco, dá para derrubar uma
  sessão. O cookie de sessão é o único do Console, e só existe para quem entrou.
- **O `user_id` vem da sessão** e entra no `WHERE` de toda consulta.

## Banco

PostgreSQL em container, com o schema versionado em `sql/`. Tabelas planejadas:

| Tabela | Para quê |
|---|---|
| `usuarios` | Dono e convidados. Convidado tem `expira_em` |
| `sessoes` | Sessões ativas, com validade |
| `projetos` | Nome, cor da paleta e o identificador do projeto no portfólio |
| `notas` | Tipo, título, corpo em Markdown, projeto, estado de publicação, datas e o vetor de busca |
| `tags` e `notas_tags` | Tags livres, ligadas às notas. Nome em minúsculas, sem espaço e sem acento |
| `versoes` | Histórico do corpo de cada nota |
| `revisoes` | Fase 2: agenda do SM-2 e o histórico de cada resposta |
| `visitas` | Fase 3: contagem diária por site, página e origem, sem IP |

**Consultas:** SQL escrito à mão com `pg`, sempre com parâmetros (`$1`). Nenhum valor é
colado na string do SQL.

**Duas camadas de isolamento:** o `WHERE user_id` em toda consulta, e RLS como segunda
camada. Para a RLS valer, a aplicação conecta com um usuário que **não é dono das
tabelas**, porque dono e superusuário ignoram policy.

**Busca:** coluna `tsvector` em `notas`, com dicionário em português e `unaccent`,
atualizada a cada gravação.

**Limpeza de convidados:** rotina agendada apaga, de hora em hora, os usuários com
`expira_em` vencido, e as notas deles junto (`ON DELETE CASCADE`).

## Rotas

| Método | Rota | Autenticação | O que faz |
|---|---|---|---|
| GET | `/api/notas` | sessão | Lista, com filtros de tipo, projeto, tag e estado |
| POST | `/api/notas` | sessão | Cria nota |
| GET PUT DELETE | `/api/notas/{id}` | sessão | Lê, salva (gera versão) e apaga |
| GET | `/api/busca` | sessão | Busca em todas as notas |
| POST DELETE | `/api/notas/{id}/publicacao` | sessão, só dono | Publica e remove do portfólio |
| POST | `/api/notas/{id}/assistente` | sessão | Organizar, corrigir ou estruturar; devolve a sugestão, não grava |
| POST | `/api/convidado` | nenhuma, com limite por IP | Cria o espaço do convidado |
| GET | `/api/publico/pilulas` | token do portfólio | Pílulas publicadas, para o build (ver `API.md`) |
| POST | `/api/visita` | nenhuma, com limite por IP | Fase 3: registra uma visita vinda dos sites, sem guardar o IP |

## Integrações externas

| Serviço | Para quê | Se cair |
|---|---|---|
| Gemini | Corrigir português e sugerir estrutura | O editor continua; o botão de IA responde `503` com o motivo. O Organizar não depende dele |
| GitHub (Actions) | Disparar o rebuild do portfólio ao publicar ou remover | A nota fica marcada como publicada, e o rebuild pode ser disparado de novo |
| GitHub (API) | Painel dos projetos, Fase 4 | O painel mostra o último estado conhecido |

## Variáveis de ambiente

Os nomes estão no [`.env.example`](../.env.example). Variável obrigatória faltando derruba
o boot, com o nome dela no log.

## Deploy

Push na `main` dispara o `.github/workflows/deploy.yml`, que atualiza o código no servidor,
reconstrói a imagem e recria o container `jvm-console`. O Caddy alcança o container pela
rede interna, na porta 8080. O workflow está desligado até o servidor estar pronto.
