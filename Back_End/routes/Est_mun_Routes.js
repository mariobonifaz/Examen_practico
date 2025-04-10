const express = require('express');
const router = express.Router();

const CatalogoController = require('../controllers/Est_mun_controller');

// Obtener todos los estados
router.get('/estados', CatalogoController.estados);

// Obtener municipios por estado
router.get('/municipios/:estadoId', CatalogoController.municipios);

module.exports = router;
