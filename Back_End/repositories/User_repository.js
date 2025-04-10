const db = require('../config/db');

const UsuarioRepository = {
  async crearUsuario({ username, password, esAdmin }) {
    const [result] = await db.query(
      'INSERT INTO Usuarios (Username, Password, EsAdmin) VALUES (?, ?, ?)',
      [username, password, esAdmin]
    );
    return result.insertId;
  },

  async obtenerUsuarioPorUsername(username) {
    const [rows] = await db.query(
      'SELECT * FROM Usuarios WHERE Username = ?',
      [username]
    );
    return rows[0];
  },

  async obtenerUsuarioPorID(id) {
    const [rows] = await db.query(
      'SELECT * FROM Usuarios WHERE UsuarioID = ?',
      [id]
    );
    return rows[0];
  }
};

module.exports = UsuarioRepository;
