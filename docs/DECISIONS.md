# 🧭 DECISIONS.md — decisões de arquitetura do __NOME__

> Decisão estrutural fica aqui, não no [`ROADMAP.md`](ROADMAP.md). Escopo é o que vai ser
> feito; decisão é por que foi feito daquele jeito, e é o que evita que alguém desfaça sem
> saber o custo.
>
> **Entra aqui:** arquitetura, framework, banco, autenticação, hospedagem, fluxo de deploy.
> **Não entra:** log de commit, ajuste visual, texto.
>
> Formato: data, decisão, motivo. Entradas mais recentes no topo.

<!-- MODELO: um bom motivo responde três coisas:
1. Qual era o problema ou a necessidade.
2. Por que esta opção e não a alternativa (diga qual foi a alternativa).
3. O custo aceito, em negrito: "**Custo aceito:** ...". Toda decisão tem um; se não
   achou o seu, ainda não entendeu a decisão. -->

| Data | Decisão | Motivo |
|---|---|---|
| __DATA__ | Documentação e fluxo herdados do `modelo-projeto` | Os outros projetos chegaram ao mesmo padrão depois de retomadas caras: reler o código inteiro para lembrar o que estava decidido. Começar com ele pronto evita repetir isso. **Custo aceito:** documento para manter desde o primeiro dia, mesmo com o projeto pequeno. |

---

## Decisões pendentes

Questões abertas, registradas para não se perderem. Cada uma diz **o que ela bloqueia**.

<!-- MODELO: exemplo:
- **Banco gerenciado ou container na VPS?** Bloqueia o primeiro arquivo de `sql/`. -->

Nenhuma ainda.