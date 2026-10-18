require('dotenv').config();

const app = require('./app');
const criarTabelas = require('./database/criarTabelas');

const PORTA = process.env.PORT || 3001;

async function iniciar() {
  try {
    await criarTabelas();
    app.listen(PORTA, () => console.log(`API rodando na porta ${PORTA}`));
  } catch (erro) {
    console.error('Não foi possível conectar ao banco de dados:', erro.message);
    process.exit(1);
  }
}

iniciar();
