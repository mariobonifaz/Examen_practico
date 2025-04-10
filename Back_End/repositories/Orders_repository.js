const db = require('../config/db');

const OrdenesRepository = {
  async crearOrden(data) {
    const {
      MunicipioID, Colonia, NumExterior, Domicilio,
      EntreCalles, FechaInicial, FechaFinal, UsuarioCreo
    } = data;

    const [result] = await db.query(`
      INSERT INTO ORDENESESERVICIO (
        MunicipioID, Colonia, NumExterior, Domicilio, EntreCalles,
        FechaInicial, FechaFinal, UsuarioCreo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      MunicipioID, Colonia, NumExterior, Domicilio, EntreCalles,
      FechaInicial, FechaFinal, UsuarioCreo
    ]);

    return result.insertId;
  },

  async obtenerOrdenesPorUsuario(usuarioId) {
    const [rows] = await db.query(`
      SELECT * FROM ORDENESESERVICIO
      WHERE UsuarioCreo = ?
      ORDER BY FechaCreacion DESC
    `, [usuarioId]);

    return rows;
  },

  async obtenerOrdenPorId(id, usuarioId) {
    const [rows] = await db.query(`
      SELECT o.*, m.EstadoID
      FROM ORDENESESERVICIO o
      JOIN Municipios m ON o.MunicipioID = m.MunicipioID
      WHERE o.OrdenServicioID = ? AND o.UsuarioCreo = ?
    `, [id, usuarioId]);

    return rows[0];
  },

  async actualizarOrden(id, data, usuarioId) {
    const {
      MunicipioID, Colonia, NumExterior, Domicilio,
      EntreCalles, FechaInicial, FechaFinal, Activo
    } = data;

    const [result] = await db.query(`
      UPDATE ORDENESESERVICIO
      SET MunicipioID = ?, Colonia = ?, NumExterior = ?, Domicilio = ?, EntreCalles = ?,
          FechaInicial = ?, FechaFinal = ?, Activo = ?
      WHERE OrdenServicioID = ? AND UsuarioCreo = ?
    `, [
      MunicipioID, Colonia, NumExterior, Domicilio,
      EntreCalles, FechaInicial, FechaFinal, Activo,
      id, usuarioId
    ]);

    return result.affectedRows > 0;
  },

  async eliminarOrden(id, usuarioId) {
    const [result] = await db.query(`
      DELETE FROM ORDENESESERVICIO
      WHERE OrdenServicioID = ? AND UsuarioCreo = ?
    `, [id, usuarioId]);

    return result.affectedRows > 0;
  },

  async verificarCruceDeFechas(fechaInicio, fechaFin, usuarioId, ordenId = null) {
    let query = `
      SELECT * FROM ORDENESESERVICIO
      WHERE UsuarioCreo = ?
        AND (
          (FechaInicial BETWEEN ? AND ?) OR
          (FechaFinal BETWEEN ? AND ?) OR
          (? BETWEEN FechaInicial AND FechaFinal) OR
          (? BETWEEN FechaInicial AND FechaFinal)
        )
    `;
  
    const params = [
      usuarioId, fechaInicio, fechaFin,
      fechaInicio, fechaFin,
      fechaInicio, fechaFin
    ];
  
    if (ordenId) {
      query += ` AND OrdenServicioID != ?`;
      params.push(ordenId);
    }
  
    const [rows] = await db.query(query, params);
    return rows.length > 0;
  }  
};

module.exports = OrdenesRepository;
