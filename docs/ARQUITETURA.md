# 🏗️ ARQUITETURA.md — como o __NOME__ funciona

> Como o sistema funciona **hoje**, por dentro. Mudou o funcionamento, muda este arquivo
> no mesmo commit. O porquê de cada escolha está no [`DECISIONS.md`](DECISIONS.md).

<!-- MODELO: enquanto o projeto estiver em planejamento, deixe o aviso abaixo. Apague quando
a primeira versão estiver no ar e este arquivo descrever o que existe. -->

> 🕐 **Arquitetura planejada.** Nada abaixo existe em código ainda.

## Visão geral

<!-- MODELO: as peças e como se ligam, num desenho de texto. Exemplo:

```
navegador ──HTTPS──> Caddy ──rede interna──> __SLUG__:8080 ──> banco
```
-->

## Autenticação

<!-- MODELO: como alguém prova quem é, onde o token é validado, e de onde vem o user_id
(sempre do token, nunca do corpo da requisição). -->

## Banco

<!-- MODELO: as tabelas, para que serve cada uma e como o dado de um usuário fica isolado
do de outro. O schema em si fica em sql/; aqui vai o raciocínio. -->

## Rotas

| Método | Rota | Autenticação | O que faz |
|---|---|---|---|
| | | | |

## Integrações externas

<!-- MODELO: cada serviço de fora, o que acontece quando ele cai (o app continua? com quê?)
e qual código HTTP o usuário recebe nesse caso (503). -->

## Variáveis de ambiente

Os nomes estão no [`.env.example`](../.env.example). Variável obrigatória faltando derruba
o boot, com o nome dela no log.

## Deploy

Push na `main` dispara o `.github/workflows/deploy.yml`, que atualiza o código no servidor,
reconstrói a imagem e recria o container `__SLUG__`. O Caddy alcança o container pela rede
interna, na porta 8080.