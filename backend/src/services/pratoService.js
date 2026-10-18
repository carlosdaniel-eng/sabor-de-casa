const pratoRepository = require('../repositories/pratoRepository');
const categoriaService = require('./categoriaService');
const { validarPrato } = require('../validators/pratoValidator');
const { converterId } = require('../validators/regras');
const AppError = require('../errors/AppError');

async function buscarPratoOuFalhar(idRecebido) {
  const id = converterId(idRecebido);
  const prato = id && (await pratoRepository.buscarPorId(id));

  if (!prato) {
    throw new AppError('Prato não encontrado.', 404);
  }
  return prato;
}

async function listarPorCategoria(categoriaId) {
  const categoria = await categoriaService.buscarCategoriaOuFalhar(categoriaId);
  return pratoRepository.listarPorCategoria(categoria.id);
}

async function criar(dados) {
  const prato = validarPrato(dados);
  await categoriaService.buscarCategoriaOuFalhar(prato.categoriaId);
  return pratoRepository.inserir(prato);
}

async function atualizar(id, dados) {
  const atual = await buscarPratoOuFalhar(id);
  const prato = validarPrato(dados);
  await categoriaService.buscarCategoriaOuFalhar(prato.categoriaId);
  return pratoRepository.atualizar(atual.id, prato);
}

async function excluir(id) {
  const prato = await buscarPratoOuFalhar(id);
  await pratoRepository.excluir(prato.id);
}

module.exports = { buscarPratoOuFalhar, listarPorCategoria, criar, atualizar, excluir };
