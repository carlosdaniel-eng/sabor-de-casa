# Sabor de Casa: cardápio digital

Trabalho da disciplina **N695 - Desenvolvimento de Plataformas Web** (Unifor), cenário 3: marmitaria com cardápio digital.

A marmitaria Sabor de Casa mandava o cardápio como foto de um quadro escrito à mão, e a foto antiga continuava circulando depois que um prato acabava ou mudava de preço. Este sistema mantém o cardápio organizado em **categorias** e **pratos**, sempre atualizado.

- **Aplicação:** _link da Vercel aqui_
- **API:** _link do Render aqui_

## Stack

| Parte | Tecnologias |
| --- | --- |
| Interface | React 19 + Vite, React Router, Axios, Bootstrap 5 |
| Serviço Web | Node.js + Express 5 (API REST em JSON) |
| Banco de dados | PostgreSQL (Supabase), acessado com a biblioteca `pg` |
| Hospedagem | Vercel (frontend) e Render (API) |

## Estrutura

```
sabor-de-casa/
├── backend/
│   └── src/
│       ├── routes/         # URLs da API
│       ├── controllers/    # recebe a requisição e devolve a resposta HTTP
│       ├── services/       # regras de negócio (nome único, não excluir com pratos...)
│       ├── validators/     # validação dos dados de entrada
│       ├── repositories/   # SQL, único lugar que fala com o banco
│       ├── database/       # conexão e criação das tabelas
│       ├── middlewares/    # tratamento de erros e rota 404
│       └── errors/         # classe AppError
└── frontend/
    └── src/
        ├── pages/          # telas
        ├── components/     # pedaços de tela reaproveitados
        ├── services/       # chamadas à API com axios
        └── utils/          # validação, formatação de preço e hook de formulário
```

## Endpoints

| Método | Rota | O que faz |
| --- | --- | --- |
| GET | `/categorias` | Lista as categorias (com o total de pratos de cada uma) |
| GET | `/categorias/:id` | Busca uma categoria |
| POST | `/categorias` | Cria uma categoria |
| PUT | `/categorias/:id` | Atualiza uma categoria |
| DELETE | `/categorias/:id` | Exclui uma categoria (só se não tiver pratos) |
| GET | `/categorias/:id/pratos` | Lista os pratos de uma categoria |
| GET | `/pratos/:id` | Busca um prato |
| POST | `/pratos` | Cria um prato |
| PUT | `/pratos/:id` | Atualiza um prato |
| DELETE | `/pratos/:id` | Exclui um prato |

Exemplo de corpo para criar um prato:

```json
{ "nome": "Frango grelhado", "descricao": "Arroz, feijão e salada", "preco": 18.5, "disponivel": true, "categoriaId": 1 }
```

## Regras validadas

- Campos obrigatórios: nome da categoria; nome, preço e categoria do prato.
- Preço maior que zero.
- Nome de categoria sem repetição (sem diferenciar maiúsculas e minúsculas).
- Não deixa excluir uma categoria que ainda tem pratos.

As regras são checadas no formulário (resposta mais rápida) e de novo na API, que é quem garante. O banco também tem `CHECK (preco > 0)`, índice único em `LOWER(nome)` e chave estrangeira com `ON DELETE RESTRICT`.

## Como rodar localmente

Pré-requisito: Node.js 20 ou mais novo e um banco PostgreSQL (pode ser o do Supabase).

```bash
# API
cd backend
npm install
cp .env.example .env    # e coloque a DATABASE_URL do seu banco
npm run dev             # http://localhost:3001

# Interface (em outro terminal)
cd frontend
npm install
npm run dev             # http://localhost:3000
```

As tabelas são criadas automaticamente quando a API sobe (`backend/src/database/schema.sql`).

## Equipe

- Nome completo, matrícula
- Nome completo, matrícula
- Nome completo, matrícula
- Nome completo, matrícula
