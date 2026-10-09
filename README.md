# 🎛️ JVM Console

Meu painel de controle pessoal: o caderno onde eu anoto o que estudo, escrevo pílulas e
tutoriais, e de onde publico no portfólio o que vale mostrar. Em fases seguintes, reúne
também as visitas dos meus sites e o estado de todos os meus projetos.

Privado por padrão. Quem visita pode entrar como **convidado**, num espaço só seu, com
notas de exemplo, que é apagado em 24 horas.

🌐 **No ar:** ainda não. Endereço planejado: `console.joaomendes.dev.br`.

> 🕐 **Em planejamento.** Existem o protótipo navegável e esta documentação; o código
> ainda não começou. O que vem primeiro está no [`docs/ROADMAP.md`](docs/ROADMAP.md).

---

## 🛠 Stack planejada

| Camada | O que é |
|---|---|
| **Backend** | Node.js com Fastify e TypeScript; SQL direto com `pg` |
| **Banco** | PostgreSQL em container na VPS, com busca de texto em português |
| **Frontend** | React com Vite, servido pelo próprio Fastify |
| **Login** | Google, só para a minha conta; quem visita entra como convidado |
| **IA** | Gemini, só no servidor, para revisar português e sugerir estrutura |
| **Hospedagem** | VPS própria, em container Docker atrás do Caddy |

O porquê de cada escolha está no [`docs/DECISIONS.md`](docs/DECISIONS.md).

## ✨ O que ele vai fazer

- **Notas em Markdown**, de três tipos: anotação, pílula e tutorial.
- **Editor com barra de formatação e prévia ao vivo**, incluindo destaque e cor de texto
  por uma lista fechada de HTML.
- **Busca em todas as notas**, sem diferenciar acento.
- **Publicar e remover do portfólio** com um botão: a pílula aparece em
  `joaomendes.dev.br` no rebuild seguinte.
- **Revisão espaçada** das anotações.
- **Organizar o texto** sem IA e **corrigir o português** com IA, sempre com tela de
  antes e depois.
- Depois: **visitas** dos meus sites, sem cookies, e um **painel** com o estado de todos
  os projetos.

## 🎨 Protótipo

O protótipo navegável, com dados fictícios, está em
[`docs/prototipo/jvm-console-v4.html`](docs/prototipo/jvm-console-v4.html). Baixe e abra
no navegador.

## 📚 Documentação

| Arquivo | Para quê |
|---|---|
| [`AGENTS.md`](AGENTS.md) | Regras para quem (pessoa ou IA) mexe neste repositório. Ler antes de tudo |
| [`docs/ROADMAP.md`](docs/ROADMAP.md) | Fases, onde está o MVP e o que vem depois |
| [`docs/DECISIONS.md`](docs/DECISIONS.md) | O que foi decidido, por quê e o custo aceito |
| [`docs/PITFALLS.md`](docs/PITFALLS.md) | Armadilhas que já aconteceram, com sintoma e conferência |
| [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md) | Como o sistema vai funcionar por dentro |
| [`docs/PAGES.md`](docs/PAGES.md) | O estado de cada tela |
| [`docs/API.md`](docs/API.md) | O contrato da API que o portfólio consome |
| [`sql/README.md`](sql/README.md) | Como o schema do banco é versionado |

Faz parte do portfólio [JVM Systems](https://joaomendes.dev.br).
