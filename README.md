# Sabor de Casa — Cardápio Digital

Trabalho final da disciplina **N695 - Desenvolvimento de Plataformas Web** (Universidade de Fortaleza — Unifor).

- **Aluno:** Carlos Daniel Albino Alves — **Matrícula:** 2523582
- **Cenário escolhido:** Cenário 3 — Marmitaria com cardápio digital (*Sabor de Casa*)
- **Aplicação publicada:** https://frontend-eight-lyart-82.vercel.app
- **API REST publicada:** https://frontend-eight-lyart-82.vercel.app/api/categorias

---

## Sobre o problema e a solução

A marmitaria **Sabor de Casa** recebia pedidos por aplicativo de mensagens e divulgava o cardápio enviando a foto de um quadro escrito à mão. Sempre que um prato acabava durante o almoço ou sofria reajuste de preço, a foto antiga continuava circulando entre os clientes e gerava pedidos incorretos.

Para resolver esse problema, foi desenvolvida uma plataforma Web completa dividida em duas entidades relacionadas (**Categoria** e **Prato**, em relação `1:N`). No sistema, a proprietária gerencia as seções do cardápio (como *Executivos do Dia*, *Linha Fitness* e *Especiais Regionais*) e controla cada prato vinculado, podendo atualizar preços na hora ou marcar um item como *Esgotado* sem precisar apagar o cadastro.

---

## Tecnologias utilizadas

| Camada | Tecnologias | Percursos |
| --- | --- | --- |
| **Interface (Frontend)** | HTML5, CSS3, Bootstrap 5, React 19, Vite, React Router DOM 7 e Axios | Percursos 1, 2 e 3 |
| **Serviço Web (Backend)** | Node.js, Express 5, arquitetura em camadas (`routes`, `controllers`, `services`, `repositories`, `validators`) | Percursos 3 e 4 |
| **Persistência de dados** | PostgreSQL (hospedado no Supabase), acessado via pool de conexões da biblioteca `pg` | Percurso 4 |
| **Hospedagem e Deploy** | Vercel (SPA estática integrada à API Express em `/api`) e GitHub | Percursos 1 a 4 |

---

## Organização do projeto

```text
sabor-de-casa/
├── backend/
│   └── src/
│       ├── routes/         # Definição das rotas HTTP de categorias e pratos
│       ├── controllers/    # Recebimento das requisições e retorno dos status HTTP
│       ├── services/       # Regras de negócio (unicidade de nome, bloqueio de exclusão)
│       ├── validators/     # Validação de campos obrigatórios, tamanhos e preço > 0
│       ├── repositories/   # Consultas SQL parametrizadas (única camada que acessa o banco)
│       ├── database/       # Pool de conexão PostgreSQL e script DDL (schema.sql)
│       ├── middlewares/    # Tratamento centralizado de erros e rota 404
│       └── errors/         # Classe AppError para erros conhecidos de negócio
├── api/
│   └── index.js            # Entrada serverless na Vercel que encaminha /api/* para o Express
└── frontend/
    └── src/
        ├── pages/          # Telas da aplicação (ListaCategorias, FormCategoria, PratosDaCategoria)
        ├── components/     # Componentes reutilizáveis (Cabecalho, Alerta, CampoFormulario, FormPrato, TabelaPratos)
        ├── services/       # Cliente Axios e funções de consumo da API REST
        └── utils/          # Hook useFormulario, formatador de moeda (BRL) e validações de formulário
```

---

## Rotas da API REST

| Entidade | Operação | Método e Rota | Status de Sucesso |
| --- | --- | --- | --- |
| Categoria | Listar todas (com contagem de pratos) | `GET /categorias` | `200 OK` |
| Categoria | Buscar por ID | `GET /categorias/:id` | `200 OK` |
| Categoria | Cadastrar nova categoria | `POST /categorias` | `201 Created` |
| Categoria | Atualizar categoria | `PUT /categorias/:id` | `200 OK` |
| Categoria | Excluir categoria (apenas sem pratos) | `DELETE /categorias/:id` | `204 No Content` |
| Prato | Listar pratos de uma categoria | `GET /categorias/:id/pratos` | `200 OK` |
| Prato | Buscar prato por ID | `GET /pratos/:id` | `200 OK` |
| Prato | Cadastrar novo prato | `POST /pratos` | `201 Created` |
| Prato | Atualizar prato | `PUT /pratos/:id` | `200 OK` |
| Prato | Excluir prato | `DELETE /pratos/:id` | `204 No Content` |

Exemplo de corpo JSON para cadastro/atualização de prato (`POST /pratos`):

```json
{
  "nome": "Frango Grelhado Acebolado",
  "descricao": "Filé de peito grelhado, arroz branco, feijão carioca, farofa e vinagrete.",
  "preco": 18.50,
  "disponivel": true,
  "categoriaId": 1
}
```

---

## Regras de negócio e validações implementadas

1. **Campos obrigatórios:** nome da categoria; nome, preço e categoria do prato (validados na interface e na API, retornando `400 Bad Request`).
2. **Preço maior que zero:** rejeita valores nulos, zero ou negativos no formulário, no validador da API (`400 Bad Request`) e na restrição `CHECK (preco > 0)` do banco.
3. **Nome de categoria sem repetição:** comparação *case-insensitive* no serviço (`409 Conflict`) e índice único `LOWER(nome)` no PostgreSQL.
4. **Bloqueio de exclusão de categoria com pratos:** antes de excluir, o serviço verifica a contagem de pratos vinculados e retorna `409 Conflict` orientando o usuário, além da integridade referencial `ON DELETE RESTRICT` na chave estrangeira.

---

## Como executar localmente

Pré-requisitos: Node.js 20+ e PostgreSQL (ou variáveis configuradas no `.env`).

```bash
# 1. Iniciar a API (porta 3001)
cd backend
npm install
cp .env.example .env
npm run dev

# 2. Iniciar a interface React (porta 3000, em outro terminal)
cd frontend
npm install
npm run dev
```
