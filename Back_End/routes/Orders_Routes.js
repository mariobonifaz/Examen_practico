const express = require('express');
const router = express.Router();

const OrdenesController = require('../controllers/Orders_controller');
const { verificarToken } = require('../middleware/auth');

router.post('/', verificarToken, OrdenesController.crear);
router.get('/', verificarToken, OrdenesController.listar);
router.get('/:id', verificarToken, OrdenesController.obtenerPorId);
router.put('/:id', verificarToken, OrdenesController.actualizar);
router.delete('/:id', verificarToken, OrdenesController.eliminar);

module.exports = router;
