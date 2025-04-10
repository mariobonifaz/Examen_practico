const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/User_ontroller');
const { verificarToken, soloAdmin } = require('../middleware/auth');

router.post('/register', verificarToken, soloAdmin, UsuarioController.registrar);
router.post('/login', UsuarioController.login);

module.exports = router;
