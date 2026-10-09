# AGENTS.md

> Instruções para qualquer IA (chat ou agente de código) que for trabalhar comigo neste
> repositório. Se você é uma ferramenta agentic (Claude Code, Cursor, Codex CLI etc.), leia
> isto antes de qualquer tarefa. Se for um chat que não lê arquivos sozinho, colei este
> conteúdo como primeira mensagem.

## Quem sou eu / como quero trabalhar

Considero-me **iniciante** na maior parte destas stacks. Construo boa parte do código com
ajuda de IA, então:

- **Sempre explique o porquê**, não só o quê. Se uma escolha técnica não for óbvia, explique
  antes de implementar.
- Priorize soluções que eu consiga entender e defender numa entrevista técnica, não a mais
  "avançada" ou abstrata possível.
- **Discorde quando eu estiver errado.** Prefiro ser corrigido a ser concordado por educação.
- Se eu pedir algo que pule uma etapa de entendimento, pode perguntar antes de obedecer.

## Este repositório

**__NOME__** é <!-- MODELO: o que o projeto é, em uma ou duas frases. -->

- **Endereço:** <!-- MODELO: https://__SLUG__.joaomendes.dev.br, ou "ainda não está no ar". -->
- **Stack:** <!-- MODELO: backend, banco, frontend. -->
- **Documentação em `docs/`.** Na raiz ficam só este `AGENTS.md`, que as ferramentas de IA
  procuram ali, e o `README.md`, que é a porta de entrada do repositório.
- **Repositório público.** Nada de IP, nome de usuário do servidor, conteúdo de `.env`, regra
  de firewall ou porta aberta para a internet entra aqui, nem em documentação, nem em
  comentário. A porta interna do container (8080) pode aparecer: ela só existe dentro da rede
  do compose. A configuração do servidor vive no repositório privado `infra`.

<!-- MODELO: se o repositório for privado, troque o último item por "Repositório privado,
mas escrito como se fosse público: se um dia abrir, nada aqui precisa ser apagado." -->

## Regras deste projeto

<!-- MODELO: as regras que valem só aqui e que ninguém pode quebrar sem saber. Cada uma em
uma linha, com o motivo. Exemplos de outros projetos:
- "user_id vem sempre do token, nunca do corpo da requisição: senão um usuário lê o dado
  de outro."
- "Toda chamada à API externa passa pelo cliente com cache: a cota é pequena." -->

## Lições de outros projetos que valem aqui

Cada uma já custou caro em outro repositório. Não precisam ser redescobertas.

- **Erro de serviço de terceiro é `503`, nunca `500`.** `500` diz "o meu código quebrou";
  `503` diz "um serviço do qual eu dependo está fora". O motivo vai no corpo da resposta.
- **Variável de ambiente obrigatória faltando derruba o boot**, com o nome dela no log. Falha
  tardia, no meio de uma requisição, esconde que a causa era configuração.
- **Schema do banco vive em `sql/`, em arquivos numerados.** Nunca `CREATE TABLE IF NOT
  EXISTS` no boot: ele cria, mas nunca altera, e esconde a diferença entre o código e o banco.
- **Container nunca publica porta com `ports`.** O proxy alcança a aplicação pela rede interna
  do compose (`expose`). Porta publicada fica aberta para a internet mesmo sem regra no
  firewall.
- **Texto do usuário nunca vai direto para `innerHTML`.** Escapar primeiro; HTML permitido só
  por lista fechada, com biblioteca de sanitização, nunca com regex própria.
- **Chave de API fica no servidor.** O que vai para o navegador, qualquer visitante lê.

## Fluxo de trabalho obrigatório

1. **Toda alteração com decisão nasce de uma issue**, escrita **antes** do código. O GitHub
   já abre o formulário no formato certo (`.github/ISSUE_TEMPLATE/`): **Funcionalidade** ou
   **Bug**.

   A issue é obrigatória quando a alteração:
   - mexe em **schema, dado de usuário, autenticação ou regra de negócio**;
   - é **correção de bug**, de qualquer tamanho: bug pequeno costuma ter causa interessante,
     e é ela que some se não for escrita;
   - envolve **escolha estrutural**: biblioteca nova, padrão de componente, navegação.

   Dispensam issue: texto de interface, ajuste visual dentro do padrão existente,
   documentação e refatoração sem mudança de comportamento.

   **Na dúvida, o teste:** daqui a três meses, alguém (inclusive eu) vai perguntar "por que
   foi feito assim?". Se sim, abre issue.

2. **Toda alteração é feita primeiro na branch `staging`**, nunca direto na `main`. O CI roda
   a cada push na `staging`; a `main` publica.

3. **Commits seguem este padrão:**

```
   tipo(escopo): descrição curta (closes #NN)
```

   Tipos: `feat`, `fix`, `refactor`, `docs`, `chore`. O escopo é a área (`api`, `ui`,
   `banco`, `deploy`...). O `closes #NN` só fecha a issue quando o commit chega à `main`.

### Sequência de comandos

```bash
# 1. Garantir que a staging local está atualizada
git checkout staging
git pull origin staging

# 2. Conferir o que mudou antes de commitar
git status
git diff

# 3. Commitar no padrão e subir para a staging (dispara o CI)
git add <arquivos alterados>
git commit -m "tipo(escopo): descrição curta (closes #NN)"
git push origin staging

# 4. Só com o CI verde: promover para a main (dispara o deploy)
git checkout main
git pull origin main
git merge staging --no-edit
git push origin main
```

- `--no-edit` evita que o merge abra o Vim pedindo mensagem.
- **Revert sempre pelo código do commit** (`git revert a1b2c3d`), nunca por `HEAD`: depois de
  um merge, `HEAD` pode não ser o commit que você pensa.
- **Verde na Action não garante código novo.** Ela reporta sucesso mesmo quando o `git pull`
  do servidor não trouxe nada. Antes de acusar o deploy, confira se o commit esperado está na
  `main` do GitHub e no `git log --oneline -3` do servidor.

## Regras de código

4. **Comentários explicam o quê e o porquê.** Número de issue (`#43`) não entra no código:
   fica na issue e no commit.

5. **Segurança não é uma fase separada.** Funcionalidade que lida com entrada de usuário,
   autenticação ou dado sensível já nasce com validação. Não se deixa para depois.

6. **Verificação de dependências (anti-legado).** Antes de propor qualquer pacote, SDK, API
   ou versão de Action, confira se é a versão atual e mantida. Não confie em dado de
   treinamento: pacote obsoleto (deprecated) ou em fim de vida não entra. Sem certeza, avise
   ou pesquise antes de gerar o código.

7. **Suspeita não é achado.** Não aponte problema sem o arquivo na mão. Levantar cinco
   hipóteses de uma vez transfere para mim o trabalho de verificar todas. Peça o arquivo, ou o
   `grep` que localiza os pontos de uso, e só então conclua.

8. **Code review antes do commit, quando vale a pena.** Para mudança não trivial (feature
   nova, autenticação, dado sensível), colo a saída de `git diff` no chat para revisão antes
   de commitar. Ajuste pequeno não precisa parar o fluxo.

## Regras de documentação

9. **Um fato, um lugar.** Nada é copiado de um documento para outro; um aponta para o outro.

   | Arquivo | O que mora nele |
   |---|---|
   | `docs/ROADMAP.md` | Escopo: fases, MVP, dívidas, ideias. A cada entrega, no mesmo push: itens marcados com `[x]` e a issue, e a tabela de status atualizada |
   | `docs/DECISIONS.md` | Decisões estruturais (arquitetura, banco, auth, framework), com o motivo e o custo aceito. Não é log de commit |
   | `docs/PITFALLS.md` | Armadilhas que já aconteceram. Corrigida é marcada, nunca apagada |
   | `docs/ARQUITETURA.md` | Como o sistema funciona hoje. Mudou o funcionamento, muda o arquivo no mesmo commit |
   | `docs/PAGES.md` | Estado de cada tela |
   | `docs/API.md` | O contrato com quem consome a API. Mudança que quebra o contrato exige aviso antes |
   | `sql/` | Schema versionado. Arquivo aplicado nunca é editado |

10. **Fase nova não vai para o fim da fila.** Se uma fase revela dívida ou requisito novo, a
    correção vira fase intermediária (ex.: 3.5), entre as duas que a originaram.

11. **Armadilha conhecida tem pergunta obrigatória.** Se a tarefa toca a área de uma
    armadilha do `docs/PITFALLS.md`, responda a pergunta dela explicitamente, com o arquivo
    real na mão, não de memória.

## Como me passar alterações

12. **Arquivo inteiro** quando a mudança passa de três pontos do mesmo arquivo.

13. **Edição por trecho (Ctrl+F)** para mudança pequena num arquivo que já existe:
    - informar o arquivo e se o passo é no **editor** ou no **terminal**;
    - mostrar o **trecho atual completo**, copiado do arquivo, para eu localizar com Ctrl+F:
      nunca número de linha, e nunca um fragmento que apareça mais de uma vez;
    - mostrar o **trecho novo completo**, que substitui o anterior;
    - se for inserção, dizer se entra **antes** ou **depois** do trecho localizado.

    Se o Ctrl+F não encontrar o trecho, **pare**: o arquivo não está no estado que a instrução
    supõe. Sem a versão atual do arquivo, peça antes.

14. **Código e arquivos de texto vão no chat, em bloco de código.** Nunca arquivo para baixar
    e nunca zip. Para arquivo novo: a pasta, o nome exato e como criar no VS Code.

15. **Diga onde o comando roda:** no notebook ou no servidor, no terminal ou no editor.

## Tom da conversa

Prefiro uma conversa natural, não uma troca robotizada de comandos. Pode explicar, sugerir,
discordar ou perguntar. As regras acima são sobre *processo* (como o código chega ao
repositório), não sobre como a conversa deve soar.

## Este projeto no portfólio

Meus projetos aparecem no portfólio **JVM Systems** (`joaomendes.dev.br`, repositório
`jvm-systems`). Este projeto entra no site por um arquivo em `src/content/projetos/`, seguindo
o `docs/CONTEUDO.md` daquele repositório.

- **O site não afirma nada que o código não sustente.** Estado, fase, stack e capa do
  estudo de caso acompanham este repositório.
- **Mudou o projeto, muda o `.mdx`.** Entrega que muda o que o estudo de caso diz exige
  atualizar o portfólio junto.