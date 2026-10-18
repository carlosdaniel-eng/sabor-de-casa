const { Router } = require('express');
const pratoController = require('../controllers/pratoController');

const router = Router();

router.post('/', pratoController.criar);
router.get('/:id', pratoController.buscar);
router.put('/:id', pratoController.atualizar);
router.delete('/:id', pratoController.excluir);

module.exports = router;
