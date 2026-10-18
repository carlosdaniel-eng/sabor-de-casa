const pool = require('../database/connection');

// O pg devolve NUMERIC como texto, então o preço é convertido aqui
function paraPrato(linha) {
  return {
    id: linha.id,
    nome: linha.nome,
    descricao: linha.descricao,
    preco: Number(linha.preco),
    disponivel: linha.disponivel,
    categoriaId: linha.categoria_id,
  };
}

const CAMPOS = 'id, nome, descricao, preco, disponivel, categoria_id';

async function listarPorCategoria(categoriaId) {
  const { rows } = await pool.query(
    `SELECT ${CAMPOS} FROM pratos WHERE categoria_id = $1 ORDER BY nome`,
    [categoriaId]
  );
  return rows.map(paraPrato);
}

async function buscarPorId(id) {
  const { rows } = await pool.query(`SELECT ${CAMPOS} FROM pratos WHERE id = $1`, [id]);
  return rows[0] ? paraPrato(rows[0]) : undefined;
}

async function contarPorCategoria(categoriaId) {
  const { rows } = await pool.query(
    'SELECT COUNT(*)::int AS total FROM pratos WHERE categoria_id = $1',
    [categoriaId]
  );
  return rows[0].total;
}

async function inserir({ nome, descricao, preco, disponivel, categoriaId }) {
  const { rows } = await pool.query(
    `INSERT INTO pratos (nome, descricao, preco, disponivel, categoria_id)
     VALUES ($1, $2, $3, $4, $5) RETURNING ${CAMPOS}`,
    [nome, descricao, preco, disponivel, categoriaId]
  );
  return paraPrato(rows[0]);
}

async function atualizar(id, { nome, descricao, preco, disponivel, categoriaId }) {
  const { rows } = await pool.query(
    `UPDATE pratos
     SET nome = $1, descricao = $2, preco = $3, disponivel = $4, categoria_id = $5
     WHERE id = $6 RETURNING ${CAMPOS}`,
    [nome, descricao, preco, disponivel, categoriaId, id]
  );
  return paraPrato(rows[0]);
}

async function excluir(id) {
  await pool.query('DELETE FROM pratos WHERE id = $1', [id]);
}

module.exports = {
  listarPorCategoria,
  buscarPorId,
  contarPorCategoria,
  inserir,
  atualizar,
  excluir,
};
