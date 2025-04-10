const CatalogoRepository = require('../repositories/Est_mun_repository');

const CatalogoService = {
  async obtenerEstados() {
    return await CatalogoRepository.obtenerEstados();
  },

  async obtenerMunicipiosPorEstado(estadoId) {
    return await CatalogoRepository.obtenerMunicipiosPorEstado(estadoId);
  }
};

module.exports = CatalogoService;
