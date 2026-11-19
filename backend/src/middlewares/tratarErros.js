const AppError = require('../errors/AppError');

// Restrições do banco que podem disparar mesmo depois da validação do service
// (ex.: duas pessoas cadastrando o mesmo nome ao mesmo tempo)
const ERROS_DO_BANCO = {
  23505: 'Já existe um registro com esse nome.',
  23503: 'A operação viola o vínculo entre categoria e prato.',
};

function tratarErros(erro, req, res, next) {
  if (erro instanceof AppError) {
    return res.status(erro.status).json({ erro: erro.message, campos: erro.campos });
  }

  if (erro.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'O corpo da requisição não é um JSON válido.' });
  }

  if (ERROS_DO_BANCO[erro.code]) {
    return res.status(409).json({ erro: ERROS_DO_BANCO[erro.code] });
  }

  console.error(erro);
  return res.status(500).json({ erro: 'Erro interno no servidor. Tente novamente mais tarde.' });
}

module.exports = tratarErros;
