# 🗄️ sql/ — schema versionado do JVM Console

> Todo DDL do projeto vive aqui, num arquivo numerado por ordem de aplicação. O servidor
> **não cria tabela no boot**: ele só conecta e confere se as tabelas existem. Se faltar
> alguma, ele não sobe, e o log diz qual arquivo daqui não foi aplicado.
>
> O motivo veio de outro projeto: `CREATE TABLE IF NOT EXISTS` no boot cria, mas nunca
> altera. Uma coluna nova nunca chegava ao banco, e o boot anunciava sucesso mesmo assim.

---

## Como usar

1. Crie o arquivo com o próximo número livre e um nome que diga o que ele faz
   (`003_cria_tabela_x.sql`).
2. Aplique **à mão**, lendo o que vai rodar.
3. Rode a conferência que está comentada no fim do arquivo.
4. Registre a data na tabela abaixo.

## Regras

- **Arquivo aplicado nunca é editado.** Correção é arquivo novo, com o motivo no
  cabeçalho. Editar um arquivo já aplicado faz o repositório mentir sobre o banco.
- **Todo arquivo se explica no cabeçalho:** o que muda, por quê, e o que acontece se for
  revertido.
- **Todo arquivo termina com a conferência**, comentada: a consulta que prova que ele fez
  o que prometeu. Contagem não basta; confira o predicado.
- **Destrutivo vem embrulhado.** `DELETE` e `DROP` de teste vão em `BEGIN; ... ROLLBACK;`
  para serem vistos sem serem aplicados.
- **A ordem em relação ao deploy importa.** Se o arquivo remove algo que o código ainda
  usa, ele roda **depois** do deploy. Se adiciona algo que o código novo exige, roda
  **antes**. O cabeçalho diz qual é o caso.

## Arquivos

| Arquivo | O que faz | Aplicado em |
|---|---|---|
| | | |

Banco novo: aplicar todos, na ordem dos números.

