const AppError = require('../errors/AppError');
const { textoVazio, textoMuitoLongo, precoInvalido, converterId } = require('./regras');

function validarPrato(dados) {
  const campos = {};

  if (textoVazio(dados.nome)) {
    campos.nome = 'O nome do prato é obrigatório.';
  } else if (textoMuitoLongo(dados.nome, 80)) {
    campos.nome = 'O nome pode ter no máximo 80 caracteres.';
  }

  if (textoMuitoLongo(dados.descricao, 300)) {
    campos.descricao = 'A descrição pode ter no máximo 300 caracteres.';
  }

  if (precoInvalido(dados.preco)) {
    campos.preco = 'O preço é obrigatório.';
  } else if (Number(dados.preco) <= 0) {
    campos.preco = 'O preço precisa ser maior que zero.';
  }

  if (!converterId(dados.categoriaId)) {
    campos.categoriaId = 'Informe a categoria do prato.';
  }

  if (Object.keys(campos).length > 0) {
    throw new AppError('Confira os campos do prato.', 400, campos);
  }

  return {
    nome: dados.nome.trim(),
    descricao: dados.descricao ? dados.descricao.trim() : null,
    preco: Number(Number(dados.preco).toFixed(2)),
    disponivel: dados.disponivel !== false,
    categoriaId: converterId(dados.categoriaId),
  };
}

module.exports = { validarPrato };
