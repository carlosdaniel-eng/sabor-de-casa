const categoriaService = require('../services/categoriaService');

async function listar(req, res) {
  res.json(await categoriaService.listar());
}

async function buscar(req, res) {
  res.json(await categoriaService.buscarCategoriaOuFalhar(req.params.id));
}

async function criar(req, res) {
  const categoria = await categoriaService.criar(req.body);
  res.status(201).json(categoria);
}

async function atualizar(req, res) {
  res.json(await categoriaService.atualizar(req.params.id, req.body));
}

async function excluir(req, res) {
  await categoriaService.excluir(req.params.id);
  res.status(204).end();
}

module.exports = { listar, buscar, criar, atualizar, excluir };
