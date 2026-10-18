const pool = require('../database/connection');

// Traz a categoria junto com a quantidade de pratos dela
function selectComTotal(filtro = '') {
  return `
    SELECT c.id, c.nome, c.descricao, COUNT(p.id)::int AS "totalPratos"
    FROM categorias c
    LEFT JOIN pratos p ON p.categoria_id = c.id
    ${filtro}
    GROUP BY c.id, c.nome, c.descricao
    ORDER BY c.nome
  `;
}

async function listar() {
  const { rows } = await pool.query(selectComTotal());
  return rows;
}

async function buscarPorId(id) {
  const { rows } = await pool.query(selectComTotal('WHERE c.id = $1'), [id]);
  return rows[0];
}

async function buscarPorNome(nome) {
  const { rows } = await pool.query(
    'SELECT id, nome FROM categorias WHERE LOWER(nome) = LOWER($1)',
    [nome]
  );
  return rows[0];
}

async function inserir({ nome, descricao }) {
  const { rows } = await pool.query(
    'INSERT INTO categorias (nome, descricao) VALUES ($1, $2) RETURNING id',
    [nome, descricao]
  );
  return buscarPorId(rows[0].id);
}

async function atualizar(id, { nome, descricao }) {
  await pool.query('UPDATE categorias SET nome = $1, descricao = $2 WHERE id = $3', [
    nome,
    descricao,
    id,
  ]);
  return buscarPorId(id);
}

async function excluir(id) {
  await pool.query('DELETE FROM categorias WHERE id = $1', [id]);
}

module.exports = { listar, buscarPorId, buscarPorNome, inserir, atualizar, excluir };
