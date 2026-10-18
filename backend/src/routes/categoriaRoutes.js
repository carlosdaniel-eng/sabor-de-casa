const { Router } = require('express');
const categoriaController = require('../controllers/categoriaController');
const pratoController = require('../controllers/pratoController');

const router = Router();

router.get('/', categoriaController.listar);
router.post('/', categoriaController.criar);
router.get('/:id', categoriaController.buscar);
router.put('/:id', categoriaController.atualizar);
router.delete('/:id', categoriaController.excluir);

router.get('/:id/pratos', pratoController.listarDaCategoria);

module.exports = router;
