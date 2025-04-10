const OrdenesRepository = require('../repositories/Orders_repository');

const OrdenesService = {
    async crearOrden(data) {
      const {
        MunicipioID,
        Colonia,
        NumExterior,
        Domicilio,
        EntreCalles,
        FechaInicial,
        FechaFinal,
        UsuarioCreo
      } = data;
  
      const fechasCruzan = await OrdenesRepository.verificarCruceDeFechas(
        FechaInicial, FechaFinal, UsuarioCreo
      );
  
      if (fechasCruzan) {
        throw new Error('Ya existe una orden en ese rango de fechas para este usuario.');
      }
  
      const nuevaOrdenId = await OrdenesRepository.crearOrden({
        MunicipioID,
        Colonia,
        NumExterior,
        Domicilio,
        EntreCalles,
        FechaInicial,
        FechaFinal,
        UsuarioCreo
      });
  
      return nuevaOrdenId;
    },
  
    async obtenerOrdenesDelUsuario(usuarioId) {
      return await OrdenesRepository.obtenerOrdenesPorUsuario(usuarioId);
    },
  
    async obtenerOrdenPorId(id, usuarioId) {
      return await OrdenesRepository.obtenerOrdenPorId(id, usuarioId);
    },
  
    async actualizarOrden(id, data, usuarioId) {
      const fechasCruzan = await OrdenesRepository.verificarCruceDeFechas(
        data.FechaInicial, data.FechaFinal, usuarioId, id
      );
  
      if (fechasCruzan) {
        throw new Error('Ya existe una orden en ese rango de fechas para este usuario.');
      }
  
      const actualizada = await OrdenesRepository.actualizarOrden(id, data, usuarioId);
      if (!actualizada) {
        throw new Error('No se encontró la orden o no tienes permisos.');
      }
  
      return true;
    },
  
    async eliminarOrden(id, usuarioId) {
      const eliminada = await OrdenesRepository.eliminarOrden(id, usuarioId);
      if (!eliminada) {
        throw new Error('No se encontró la orden o no tienes permisos.');
      }
      return true;
    }
  };
  
  module.exports = OrdenesService;