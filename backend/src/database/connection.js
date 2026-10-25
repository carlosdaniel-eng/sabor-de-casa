const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// O Supabase encerra conexões paradas; sem este listener o erro derruba a API inteira.
// O pool descarta a conexão perdida e abre outra na próxima consulta.
pool.on('error', (erro) => {
  console.error('Conexão com o banco encerrada:', erro.message);
});

module.exports = pool;
