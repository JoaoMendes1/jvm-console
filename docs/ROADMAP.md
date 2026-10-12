# 🗺️ Roadmap do JVM Console

Este documento mapeia a evolução do projeto: o que já está de pé, o que está em andamento
e o que vem depois.

> **Decisão de arquitetura não mora aqui.** Escopo é o que vai ser feito; o porquê vai
> para o [`DECISIONS.md`](DECISIONS.md).

## 📍 Status (12/10/2026)

| Fase | Status |
|---|---|
| 0 · Planejamento: protótipo e documentação | ✅ Concluída |
| 1 · MVP: notas, busca e publicação | 🚧 Em andamento |
| 2 · Estudo e convidado | 🕐 Planejada |
| 3 · Visitas | 🕐 Planejada |
| 4 · Painel dos projetos | 🕐 Planejada |
| 5 · Busca semântica | 🕐 Planejada |

---

## 🎯 Onde está o MVP

**O MVP é a Fase 1:** entrar com Google, escrever e buscar notas, e publicar pílula no
portfólio. Com isso no ar, o Console já substitui o jeito atual de publicar pílula
(arquivo `.mdx` escrito à mão no repositório do portfólio).

Tudo o que não está na Fase 1 vem depois do MVP, por melhor que seja a ideia.

---

## 🧭 Fase 0: Planejamento (✅ Concluída)

- [x] Protótipo navegável das telas principais (`docs/prototipo/jvm-console-v4.html`)
- [x] Documentação-base criada a partir do `modelo-projeto`
- [x] Decisões de arquitetura registradas no `DECISIONS.md`
- [x] Decisões de stack fechadas: Fastify, React com Vite, login só para o dono, `pg`,
      sanitização, tags livres e SM-2
- [x] Caixas de aviso: o portfólio converte no build, com 4 tipos (`API.md`)
- [x] Estudo de caso no portfólio, marcado como em planejamento

## 🏗️ Fase 1: MVP: notas, busca e publicação (� Em andamento)

- [x] **Esqueleto do servidor:** Fastify com TypeScript, ainda sem funcionalidade, e CI
      na `staging` (#1).
- [ ] **Login com Google só para a minha conta**, com sessão guardada no banco. Quem não
      é o dono vê a opção de entrar como convidado.
- [ ] **Schema inicial em `sql/`**: usuários, sessões, notas, projetos, tags e versões.
- [ ] **Notas:** criar, editar, apagar, com tipo (anotação, pílula, tutorial), projeto e
      tags. O campo de tag sugere as existentes e pede confirmação para criar uma nova.
- [ ] **Editor em Markdown** com prévia ao vivo, barra de formatação e atalhos (Ctrl+B,
      Ctrl+I).
- [ ] **HTML por lista fechada**, sanitizado com DOMPurify, com teste automatizado
      provando que `<script>` e atributos de evento não passam.
- [ ] **Achar na nota** (Ctrl+F na prévia), com contagem "1 de N".
- [ ] **Histórico de versões** da nota.
- [ ] **Lista de notas com filtros:** tipo, projeto, tag e estado. Projeto com cor fixa
      de paleta.
- [ ] **Busca em todas as notas**, em português e sem diferenciar acento.
- [ ] **Publicar e remover do portfólio:** API para o build do portfólio e disparo do
      rebuild (ver `API.md`). Endereço e data editáveis antes da primeira publicação.
- [ ] **Caixas de aviso no portfólio:** a citação com marcador (`> [!TIP]` e os outros
      3 tipos) vira caixa no build, depois da sanitização, com a cor de cada tipo (ver
      `API.md`). No Console, o botão de aviso da barra insere o marcador sozinho na
      linha, como o GitHub exige; o protótipo põe o título na mesma linha.
- [ ] **Recriar as pílulas atuais** no Console, com o mesmo endereço e a mesma data. Os
      `.mdx` saem do portfólio no mesmo deploy em que ele passa a ler do Console.
- [ ] **Backup diário** do banco junto da rotina dos outros projetos. Obrigatório antes
      de qualquer nota real entrar.
- [ ] **Deploy:** container atrás do Caddy, em `console.joaomendes.dev.br`, com CI na
      `staging` e deploy na `main`.

## 🎓 Fase 2: Estudo e convidado (🕐 Planejada)

- [ ] **Revisão espaçada com SM-2** (esqueci, com esforço, fácil), gravando o histórico
      de cada resposta.
- [ ] **Teste de mesa do SM-2:** acerto, acerto com esforço, erro, primeira revisão e teto
      de intervalo.
- [ ] **Modo convidado:** espaço próprio por visitante, com notas de exemplo, apagado em
      24 horas por rotina agendada. Publicar desativado. Limite de criação de
      convidados por IP.
- [ ] **Organizar** (sem IA): títulos, listas, linhas em branco e espaços, sem mudar
      nenhuma palavra.
- [ ] **Corrigir português** e **Melhorar estrutura** com o Gemini, sempre pela tela de
      antes e depois, com recusa por mudança.
- [ ] **Teto diário** de chamadas à IA, lido do banco.
- [ ] **Demonstração da IA para o convidado**, com respostas prontas para as notas de
      exemplo.

## 📈 Fase 3: Visitas (🕐 Planejada)

- [ ] **Coleta sem cookies e sem IP:** hash do dia com sal que troca todo dia.
- [ ] **Painel de visitas** dos três sites: por dia, de onde vieram e páginas mais
      vistas.
- [ ] **Atualizar a página `/privacidade` do portfólio** no mesmo dia em que a coleta
      começar.

## 🧩 Fase 4: Painel dos projetos (🕐 Planejada)

- [ ] **Estado de cada projeto:** no ar ou fora (health check), último deploy e issues
      abertas, pela API do GitHub.
- [ ] **Histórico curto** de disponibilidade por projeto.

## 🔍 Fase 5: Busca semântica (🕐 Planejada)

- [ ] **pgvector** e embedding das notas, para achar nota parecida mesmo sem a mesma
      palavra.

---

## 🧹 Dívida técnica conhecida

Nenhuma ainda.

## 💡 Ideias, sem compromisso

> Nada aqui é escopo. Uma ideia só sobe para uma fase quando ganha motivo.

- **Modelos de nota** (pílula, tutorial, decisão), já com a estrutura pronta.
- **Modo foco:** esconde prévia e metadados para escrever.
- **Exportar tudo em `.md`**, para as notas nunca ficarem presas no app.
- **Colar print com Ctrl+V**, com a imagem guardada no servidor. Sem upload para
  convidado.
- **Links entre notas** (`[[nome]]`) e lista de quem aponta para cada nota.
- **Tour guiado** para o convidado.
- **App instalável (PWA)** e **lembrete diário de revisão** por notificação.
- **Issue do GitHub vira rascunho de pílula**, junto com o Painel da Fase 4.
- **Menu "/" estilo Notion** no editor.
- **Diferença entre versões** no histórico da nota.
- **Corretor de português sem IA** (LanguageTool em container), se o custo do Gemini
  pesar.

## 🗑️ Avaliado e descartado

- **Cor escolhida por tag.** Em pouco tempo seriam dezenas de cores sem significado. A
  cor ficou no projeto, numa paleta fixa.
- **Tipo de nota criado pelo usuário.** Tipo sem comportamento próprio é só uma tag com
  outro nome.
- **Limite de usos de IA por convidado.** Cada visita cria um espaço novo, então o
  limite zerava abrindo outra sessão. Convidado ficou só com a demonstração.

## 🔧 Manutenção

### 12/10/2026 — Fase 1 começou

O esqueleto do servidor e o CI na `staging` estão no repositório. Nada está no ar: o
deploy continua desligado até o servidor estar pronto.

A última decisão pendente, as caixas de aviso, foi fechada, e o estudo de caso está no
portfólio. O próximo passo é a Fase 1.

### 06/10/2026 — Projeto criado

Repositório criado a partir do `modelo-projeto`, com a documentação-base, o protótipo v4
e o fluxo `staging` → `main` iguais aos outros projetos.