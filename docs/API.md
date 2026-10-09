# 🔌 API.md — o contrato da API do __NOME__

<!-- MODELO: opcional. Só existe quando outro projeto consome esta API. Apague se não for
o caso. -->

> Este arquivo é um **contrato**: outro projeto depende do que está escrito aqui. Mudar o
> formato sem avisar quebra o outro lado, e em geral quebra em silêncio ou no deploy dele.

## Quem consome

| Projeto | Para quê | Quando chama |
|---|---|---|
| | | <!-- MODELO: em tempo de execução, ou só no build? --> |

## Autenticação

<!-- MODELO: como o consumidor prova que pode chamar (ex.: token fixo no header, guardado
como secret nos dois repositórios). Nunca o valor do token, só o nome do header. -->

## Rotas

### `GET /api/exemplo`

O que devolve e em que situação.

```json
{
  "campo": "exemplo"
}
```

| Campo | Tipo | Sempre presente? | O que é |
|---|---|---|---|
| `campo` | texto | sim | |

## Erros

| Código | Quando |
|---|---|
| `401` | Token ausente ou errado |
| `503` | Um serviço do qual esta API depende está fora |

## Regras de mudança

- **Pode sem aviso:** campo novo na resposta. Consumidor bem escrito ignora o que não usa.
- **Exige aviso antes:** campo renomeado ou removido, tipo trocado, rota mudada. Primeiro o
  consumidor passa a aceitar os dois formatos, depois esta API muda, depois o formato velho
  sai.
- Toda mudança neste arquivo vai no mesmo commit da mudança no código.