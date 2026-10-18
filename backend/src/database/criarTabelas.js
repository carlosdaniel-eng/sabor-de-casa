const fs = require('fs');
const path = require('path');
const pool = require('./connection');

async function tabelasJaExistem() {
  const { rows } = await pool.query("SELECT to_regclass('public.pratos') AS tabela");
  return rows[0].tabela !== null;
}

// Roda o schema.sql só num banco vazio. No Supabase as tabelas já foram criadas
// e o usuário da API não é dono delas, então não pode rodar o script de novo.
async function criarTabelas() {
  if (await tabelasJaExistem()) return;

  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await pool.query(sql);
}

module.exports = criarTabelas;
