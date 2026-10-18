const categoriaRepository = require('../repositories/categoriaRepository');
const pratoRepository = require('../repositories/pratoRepository');
const { validarCategoria } = require('../validators/categoriaValidator');
const { converterId } = require('../validators/regras');
const AppError = require('../errors/AppError');

async function buscarCategoriaOuFalhar(idRecebido) {
  const id = converterId(idRecebido);
  const categoria = id && (await categoriaRepository.buscarPorId(id));

  if (!categoria) {
    throw new AppError('Categoria não encontrada.', 404);
  }
  return categoria;
}

async function garantirNomeDisponivel(nome, idAtual = null) {
  const existente = await categoriaRepository.buscarPorNome(nome);

  if (existente && existente.id !== idAtual) {
    throw new AppError(`Já existe uma categoria chamada "${existente.nome}".`, 409, {
      nome: 'Esse nome já está em uso.',
    });
  }
}

function listar() {
  return categoriaRepository.listar();
}

async function criar(dados) {
  const categoria = validarCategoria(dados);
  await garantirNomeDisponivel(categoria.nome);
  return categoriaRepository.inserir(categoria);
}

async function atualizar(id, dados) {
  const atual = await buscarCategoriaOuFalhar(id);
  const categoria = validarCategoria(dados);
  await garantirNomeDisponivel(categoria.nome, atual.id);
  return categoriaRepository.atualizar(atual.id, categoria);
}

async function excluir(id) {
  const categoria = await buscarCategoriaOuFalhar(id);
  const totalPratos = await pratoRepository.contarPorCategoria(categoria.id);

  if (totalPratos > 0) {
    throw new AppError(
      `Não é possível excluir "${categoria.nome}": ainda há ${totalPratos} prato(s) nela. ` +
        'Exclua os pratos antes.',
      409
    );
  }
  await categoriaRepository.excluir(categoria.id);
}

module.exports = { listar, buscarCategoriaOuFalhar, criar, atualizar, excluir };
