const AppError = require('../errors/AppError');

function tratarErros(erro, req, res, next) {
  if (erro instanceof AppError) {
    return res.status(erro.status).json({ erro: erro.message, campos: erro.campos });
  }

  if (erro.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'O corpo da requisição não é um JSON válido.' });
  }

  console.error(erro);
  return res.status(500).json({ erro: 'Erro interno no servidor. Tente novamente mais tarde.' });
}

module.exports = tratarErros;
