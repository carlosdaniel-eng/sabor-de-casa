const AppError = require('../errors/AppError');
const { textoVazio, textoMuitoLongo } = require('./regras');

function validarCategoria(dados) {
  const campos = {};

  if (textoVazio(dados.nome)) {
    campos.nome = 'O nome da categoria é obrigatório.';
  } else if (textoMuitoLongo(dados.nome, 60)) {
    campos.nome = 'O nome pode ter no máximo 60 caracteres.';
  }

  if (textoMuitoLongo(dados.descricao, 200)) {
    campos.descricao = 'A descrição pode ter no máximo 200 caracteres.';
  }

  if (Object.keys(campos).length > 0) {
    throw new AppError('Confira os campos da categoria.', 400, campos);
  }

  return {
    nome: dados.nome.trim(),
    descricao: dados.descricao ? dados.descricao.trim() : null,
  };
}

module.exports = { validarCategoria };
