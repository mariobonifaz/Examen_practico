const UsuarioRepository = require('../repositories/User_repository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UsuarioService = {
  async registrar(username, password, esAdmin = false) {
    const existe = await UsuarioRepository.obtenerUsuarioPorUsername(username);
    if (existe) throw new Error('El usuario ya existe');

    const hashed = await bcrypt.hash(password, 10);
    const userId = await UsuarioRepository.crearUsuario({ username, password: hashed, esAdmin });
    return { userId };
  },

  async login(username, password) {
    const usuario = await UsuarioRepository.obtenerUsuarioPorUsername(username);
    if (!usuario) throw new Error('Usuario no encontrado');

    const valido = await bcrypt.compare(password, usuario.Password);
    if (!valido) throw new Error('Contraseña incorrecta');

    const token = jwt.sign(
      { id: usuario.UsuarioID, esAdmin: usuario.EsAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '4h' }
    );

    return {
      token,
      usuario: {
        id: usuario.UsuarioID,
        username: usuario.Username,
        esAdmin: usuario.EsAdmin
      }
    };
  }
};

module.exports = UsuarioService;
