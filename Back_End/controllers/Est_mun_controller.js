const CatalogoService = require('../services/Est_mun_service');

const CatalogoController = {
  async estados(req, res) {
    try {
      const estados = await CatalogoService.obtenerEstados();
      res.status(200).json(estados);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener estados' });
    }
  },

  async municipios(req, res) {
    try {
      const estadoId = req.params.estadoId;
      const municipios = await CatalogoService.obtenerMunicipiosPorEstado(estadoId);
      res.status(200).json(municipios);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener municipios' });
    }
  }
};

module.exports = CatalogoController;
