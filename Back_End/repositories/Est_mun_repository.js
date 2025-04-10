const db = require('../config/db');

const CatalogoRepository = {
  async obtenerEstados() {
    const [rows] = await db.query(`
      SELECT EstadoID, Estado FROM Estados
      WHERE Activo = true
      ORDER BY Estado
    `);
    return rows;
  },

  async obtenerMunicipiosPorEstado(estadoId) {
    const [rows] = await db.query(`
      SELECT MunicipioID, Municipio FROM Municipios
      WHERE EstadoID = ? AND Activo = true
      ORDER BY Municipio
    `, [estadoId]);
    return rows;
  }
};

module.exports = CatalogoRepository;
