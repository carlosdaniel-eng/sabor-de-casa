const pratoService = require('../services/pratoService');

async function listarDaCategoria(req, res) {
  res.json(await pratoService.listarPorCategoria(req.params.id));
}

async function buscar(req, res) {
  res.json(await pratoService.buscarPratoOuFalhar(req.params.id));
}

async function criar(req, res) {
  const prato = await pratoService.criar(req.body);
  res.status(201).json(prato);
}

async function atualizar(req, res) {
  res.json(await pratoService.atualizar(req.params.id, req.body));
}

async function excluir(req, res) {
  await pratoService.excluir(req.params.id);
  res.status(204).end();
}

module.exports = { listarDaCategoria, buscar, criar, atualizar, excluir };
