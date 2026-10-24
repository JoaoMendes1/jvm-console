# AGENTS.md

> Regras para quem trabalha neste repositório, pessoa ou IA. Ferramentas de IA (Claude Code,
> Cursor, Codex CLI etc.) leem este arquivo antes de qualquer tarefa.

## Este repositório

**JVM Console** é um painel de controle pessoal: caderno de estudo em Markdown (anotações,
pílulas e tutoriais), publicação de pílulas no portfólio e, em fases seguintes, visitas dos
sites e estado dos projetos. Visitante entra como convidado, num espaço próprio e temporário.

- **Estado:** Fase 1 em andamento. Existe o esqueleto do servidor em `src/`, ainda sem
  nenhuma funcionalidade e fora do ar.
- **Endereço planejado:** `console.joaomendes.dev.br`.
- **Stack:** Fastify com TypeScript, SQL direto com `pg` (sem ORM), PostgreSQL em container e
  React com Vite servido pelo Fastify. O porquê está no `docs/DECISIONS.md`; trocar qualquer
  peça é decisão nova, registrada lá antes do código.
- **Documentação em `docs/`.** Na raiz ficam só este `AGENTS.md`, que as ferramentas de IA
  procuram ali, e o `README.md`, a porta de entrada do repositório.
- **Repositório público.** Nada de IP, nome de usuário do servidor, conteúdo de `.env`, regra
  de firewall ou porta aberta para a internet entra aqui, nem em documentação, nem em
  comentário. A porta interna do container (8080) pode aparecer: só existe na rede do compose.
- **A infraestrutura do servidor é mantida no repositório privado `infra`:** compose de
  produção e proxy. DNS, backup e variáveis do servidor também ficam fora daqui. Quando uma
  mudança exigir algo no servidor (serviço no compose, subdomínio, variável nova), indique o
  que precisa mudar lá.

## Regras deste projeto

Valem só aqui. Cada uma com o motivo, para não ser quebrada sem saber o custo.

- **`user_id` vem sempre da sessão, nunca do corpo da requisição**, e entra no `WHERE`
  de toda consulta. Convidado também é usuário: o espaço de um nunca aparece para outro.
- **A aplicação conecta no banco com um usuário que não é dono das tabelas.** Dono e
  superusuário ignoram RLS. No Grimoire, o backend conecta como `postgres` e por isso
  ignora as policies.
- **HTML no Markdown só pela lista fechada** (`<mark class="laranja|roxo|verde">` e
  `<span class="t-…">`), filtrado por biblioteca de sanitização, nunca por regex própria.
  O portfólio aplica a mesma lista ao renderizar a pílula: mudou a lista aqui, muda lá
  no mesmo dia.
- **A chave do Gemini existe só no servidor**, é exclusiva deste projeto (separada da do
  AniDeck) e tem teto diário de chamadas.
- **Convidado nunca chama a IA de verdade.** Recebe respostas prontas, geradas antes, para
  as notas de exemplo.
- **IA nunca altera a nota sozinha.** Toda sugestão passa pela tela de antes e depois, e
  cada mudança pode ser recusada.
- **Visita não guarda cookie nem IP.** Só o hash do dia, com um sal que troca todo dia.
- **O contrato com o portfólio está no `docs/API.md`.** Mudança que quebra o contrato
  quebra o build do portfólio: avise antes, mude depois.
- **Só a minha conta Google entra como dono**, conferida pelo ID da conta
  (`OWNER_GOOGLE_ID`), nunca pelo e-mail. Qualquer outra pessoa é convidado.
- **Valor nunca é colado na string do SQL.** Sempre parâmetro (`$1`, `$2`...).
- **Corpo de pílula vai para o portfólio como Markdown, nunca como MDX:** o MDX executa
  código durante o build.
- **Tipos de nota são fixos:** anotação, pílula e tutorial, cada um com comportamento
  próprio. Classificação livre é tag.
- **TypeScript só com sintaxe que o Node consegue apagar:** nada de `enum` nem
  `namespace`. O `npm run dev` roda o `.ts` direto, e o `tsc` acusa o que não der para
  apagar. Import relativo leva a extensão `.ts` (`./app.ts`).
- **Sem testes automatizados por enquanto** (ver `docs/DECISIONS.md`). A conferência é
  rodando o app no localhost. Não crie arquivo de teste sem combinar antes.

## Lições de outros projetos que valem aqui

Cada uma já custou caro em outro repositório.

- **Erro de serviço de terceiro é `503`, nunca `500`.** `500` diz "o meu código quebrou";
  `503`, "um serviço do qual eu dependo está fora". O motivo vai no corpo da resposta.
- **Variável de ambiente obrigatória faltando derruba o boot**, com o nome dela no log. Falha
  tardia, no meio de uma requisição, esconde que a causa era configuração.
- **Recurso de outro usuário responde `404`, não `403`.** O `403` confirma que o recurso
  existe.
- **Schema versionado em `sql/`, em arquivos numerados**, e arquivo aplicado nunca é editado.
  Nunca `CREATE TABLE IF NOT EXISTS` no boot: cria, mas nunca altera, e esconde a diferença
  entre o código e o banco.
- **No servidor, nenhum container publica porta com `ports`.** O proxy alcança a aplicação
  pela rede interna (`expose`); porta publicada fica aberta mesmo sem regra no firewall.
- **Fim de linha LF em todos os arquivos**, pelo `.gitattributes`. Script com CRLF quebra no
  container Linux com um erro que não aponta a causa.
- **Segredo fica no servidor.** O que vai para o navegador, qualquer visitante lê, inclusive
  as variáveis que o build do frontend embute.

## Fluxo de trabalho obrigatório

1. **Toda alteração com decisão nasce de uma issue**, escrita antes do código, por um dos
   modelos em `.github/ISSUE_TEMPLATE/`: **Funcionalidade** ou **Bug**. A issue é
   obrigatória quando a alteração:
   - mexe em schema, dado de usuário, autenticação ou regra de negócio;
   - corrige bug, de qualquer tamanho: a causa é o que mais ensina, e some se não for escrita;
   - envolve escolha estrutural: biblioteca nova, padrão de componente, navegação;
   - muda como o projeto sobe ou é publicado: compose, `Dockerfile`, CI, deploy.

   Dispensam issue: texto de interface, ajuste visual dentro do padrão, documentação,
   configuração do repositório, refatoração sem mudança de comportamento e atualização de
   dependência sem mudança de código (`chore(deps)`). Na dúvida: daqui a três meses, alguém
   vai perguntar "por que foi feito assim?"? Se sim, abre issue.

2. **Toda alteração entra primeiro na branch `staging`**, nunca direto na `main`. O CI roda a
   cada push na `staging`, e só se promove com ele verde. A `main` é a versão publicada: com o
   deploy ligado, o push nela publica.

3. **Commits:** `tipo(escopo): descrição curta (closes #NN)`. Tipos: `feat`, `fix`,
   `refactor`, `docs`, `chore`. Escopos usados aqui: `api`, `ui`, `banco`, `ci`, `deploy` e
   `infra` (documentação e configuração). O `closes #NN` só fecha a issue quando o commit
   chega à `main`.

**Labels:** catálogo do `modelo-projeto`, nome em inglês e descrição em português. Toda issue
recebe um tipo e uma ou mais áreas. Os modelos de issue aplicam `feature` e `bug` pelo nome
exato: renomear uma delas faz o modelo deixar de aplicá-la, sem erro.

| Grupo | Labels |
|---|---|
| Tipo | `feature`, `enhancement`, `bug`, `security`, `refactor`, `documentation`, `chore`, `decision` |
| Área | `backend`, `frontend`, `database`, `auth`, `infra`, `integration`, `ai`, `mobile`, `ui/ux` |

**Quadro** (GitHub Projects): **Todo → In Progress → Staging Done → Done**.

- A issue nova entra sozinha em Todo, pelo auto-add; a fechada vai sozinha para Done.
- A passagem para Staging Done é manual: o `closes` só age na `main`.
- Nunca arraste um cartão para Done à mão: isso fecha a issue antes de o código chegar à
  `main`.

```bash
# 1. Staging local atualizada
git checkout staging
git pull origin staging

# 2. Preparar e conferir, numa passada só, o que vai entrar no commit
git add -A && git status && git --no-pager diff --cached -M

# 3. Commitar e subir para a staging (dispara o CI)
git commit -m "tipo(escopo): descrição curta (closes #NN)"
git push origin staging

# 4. Com o CI verde: promover e voltar à staging
git checkout main
git pull origin main
git merge staging --no-edit
git push origin main
git checkout staging
```

- `--no-edit` evita que o merge abra o Vim.
- **Revert sempre pelo código do commit** (`git revert a1b2c3d`), nunca por `HEAD`.
- **Action verde não garante código novo.** Antes de acusar o deploy, confira o commit na
  `main` do GitHub e no `git log --oneline -3` do servidor.
- **Em mais de uma máquina:** push antes de sair de uma, pull antes de começar na outra.

## Regras de código

Prefira a solução simples e defensável à mais abstrata: todo código daqui precisa poder ser
explicado, linha por linha, por quem o mantém.

4. **Comentários explicam o quê e o porquê**, em tom formal e impessoal, numa linha sempre
   que possível, e só onde o porquê não é óbvio. Número de issue não entra no código.

5. **Segurança não é uma fase separada.** Entrada de usuário, autenticação e dado sensível já
   nascem com validação.

6. **Verificação de dependências.** Antes de propor pacote, SDK, API ou versão de Action,
   confira se é a versão atual e mantida. Pacote obsoleto ou em fim de vida não entra. Sem
   certeza, pesquise antes de gerar o código.

7. **Suspeita não é achado.** Não aponte problema sem o arquivo na mão. Peça o arquivo, ou o
   `grep` que localiza os pontos de uso, e só então conclua.

8. **Revisão antes do commit** em mudança não trivial (feature nova, autenticação, dado
   sensível): a saída de `git diff --cached` é lida antes do commit.

## Regras de documentação

9. **Um fato, um lugar.** Nada é copiado de um documento para outro; um aponta para o outro.

   | Arquivo | O que mora nele |
   |---|---|
   | `docs/ROADMAP.md` | Escopo: fases, MVP, dívidas, ideias. A cada entrega, no mesmo push: itens marcados com `[x]` e a issue, e a tabela de status |
   | `docs/DECISIONS.md` | Decisões estruturais, com o porquê e o custo aceito. Não é log de commit |
   | `docs/PITFALLS.md` | Falhas silenciosas que já aconteceram. Corrigida é marcada, nunca apagada |
   | `docs/ARQUITETURA.md` | Como o sistema funciona hoje. Mudou o funcionamento, muda no mesmo commit |
   | `docs/PAGES.md` | Estado de cada tela |
   | `docs/API.md` | O contrato com o portfólio. Mudança que quebra o contrato exige aviso antes |
   | `sql/` | Schema versionado. Arquivo aplicado nunca é editado |

10. **Fase nova não vai para o fim da fila.** Dívida ou requisito descoberto no caminho vira
    fase intermediária (ex.: 3.5), entre as duas que a originaram.

11. **Armadilha conhecida tem pergunta obrigatória.** Tarefa que toca a área de uma armadilha
    do `docs/PITFALLS.md` responde a pergunta dela, com o arquivo real na mão.

## Este projeto no portfólio

Este projeto aparece no portfólio **JVM Systems** (`joaomendes.dev.br`, repositório
`jvm-systems`), por um arquivo em `src/content/projetos/`. O site não afirma nada que o
código não sustente: entrega que muda o estado, a fase, a stack ou a capa muda também o
estudo de caso.
