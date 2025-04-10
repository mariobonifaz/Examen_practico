const UsuarioService = require('../services/User_service');

const UsuarioController = {
  async registrar(req, res) {
    const { username, password, esAdmin } = req.body;
    try {
      const result = await UsuarioService.registrar(username, password, esAdmin);
      res.status(201).json({ message: 'Usuario creado', userId: result.userId });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async login(req, res) {
    const { username, password } = req.body;
    try {
      const result = await UsuarioService.login(username, password);
      res.status(200).json(result);
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  }
};

module.exports = UsuarioController;
