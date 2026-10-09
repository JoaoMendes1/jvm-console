# 🔌 API.md — o contrato da API do JVM Console

> Este arquivo é um **contrato**: outro projeto depende do que está escrito aqui. Mudar o
> formato sem avisar quebra o outro lado, e em geral quebra em silêncio ou no deploy dele.

> 🕐 **Contrato planejado.** A rota ainda não existe. Os campos seguem o schema das
> pílulas do portfólio (`src/content.config.ts` do `jvm-systems`), que muda junto: a lista
> fechada de tags sai e o corpo passa a vir daqui.

## Quem consome

| Projeto | Para quê | Quando chama |
|---|---|---|
| `jvm-systems` (portfólio) | Montar as páginas de pílula a partir das notas publicadas | **Só no build**, por um loader de conteúdo do Astro. Nunca em tempo de execução |

## Autenticação

Header `Authorization: Bearer <token>`. O token fica como secret nos dois lados: no
`.env` do Console (`PORTFOLIO_API_TOKEN`) e nos secrets do repositório do portfólio. É só
de leitura e só abre esta rota.

## Rotas

### `GET /api/publico/pilulas`

Todas as pílulas publicadas, da mais recente para a mais antiga. Nota privada, apagada
ou de convidado nunca aparece aqui.

```json
[
  {
    "slug": "erro-de-terceiro-503",
    "titulo": "Erro de serviço externo não é 500",
    "resumo": "Quando a AniList caiu, o AniDeck respondia 500 numa tela, 502 em outra e 503 numa terceira.",
    "data": "2026-10-04",
    "atualizado": null,
    "tags": ["go"],
    "projeto": "anideck",
    "corpo": "Texto em Markdown..."
  }
]
```

| Campo | Tipo | Sempre presente? | O que é |
|---|---|---|---|
| `slug` | texto | sim | Endereço da pílula no site. **Não muda depois de publicada**, senão o link antigo quebra |
| `titulo` | texto | sim | |
| `resumo` | texto | sim | Até 180 caracteres, o limite do portfólio |
| `data` | data `AAAA-MM-DD` | sim | Dia da primeira publicação. Não muda depois |
| `atualizado` | data ou `null` | sim | Dia da última edição publicada, se houver; sempre posterior a `data` |
| `tags` | lista de texto | sim, com 1 ou mais | Tags livres, criadas no Console. Formato: minúsculas, sem espaço e sem acento (`^[a-z0-9-]+$`) |
| `projeto` | texto ou `null` | sim | Identificador do projeto no portfólio (`anideck`, `grimoire`...) |
| `corpo` | texto | sim | Markdown, com HTML só da lista fechada (abaixo) |

### Como o portfólio trata o `corpo`

- **Como Markdown comum, nunca como MDX.** O MDX executa expressões JavaScript (`{...}`)
  durante o build; texto vindo daqui não pode ter esse poder.
- **Sanitizado com rehype-sanitize**, pela mesma lista fechada que a DOMPurify aplica no
  Console:

| Tag | Atributo permitido | Valores |
|---|---|---|
| `mark` | `class` | `laranja`, `roxo`, `verde` |
| `span` | `class` | `t-laranja`, `t-roxo`, `t-verde` |
| as que o próprio Markdown gera (`p`, `h2`, `ul`, `code`, `pre`, `table`, `a`...) | `href` só em `a`, só `https` | |

Qualquer outra tag ou atributo some. Mudou esta tabela, mudam as duas configurações no
mesmo dia.

**Caixas de aviso:** no Console, elas são escritas no formato do GitHub (`> [!TIP]`).
Quem converte para o componente de aviso do portfólio, e como, ainda está em aberto
(`DECISIONS.md`, pendentes).

## Erros

| Código | Quando |
|---|---|
| `401` | Token ausente ou errado |
| `503` | O banco do Console está fora |

**Se esta rota falhar, o build do portfólio falha.** É de propósito: publicar o site sem
as pílulas seria pior que manter a versão anterior no ar.

## Regras de mudança

- **Pode sem aviso:** campo novo na resposta. Consumidor bem escrito ignora o que não usa.
- **Exige aviso antes:** campo renomeado ou removido, tipo trocado, rota mudada. Primeiro o
  consumidor passa a aceitar os dois formatos, depois esta API muda, depois o formato velho
  sai.
- **Mudou o schema das pílulas no portfólio, muda este arquivo** no mesmo dia.
- Toda mudança neste arquivo vai no mesmo commit da mudança no código.
