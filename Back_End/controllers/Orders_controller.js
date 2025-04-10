const OrdenesService = require('../services/Orders_service');

const OrdenesController = {
    async crear(req, res) {
      try {
        const data = {
          ...req.body,
          UsuarioCreo: req.user.id
        };
  
        const nuevaOrdenId = await OrdenesService.crearOrden(data);
        res.status(201).json({ message: 'Orden creada', id: nuevaOrdenId });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },
  
    async listar(req, res) {
      try {
        const ordenes = await OrdenesService.obtenerOrdenesDelUsuario(req.user.id);
        res.status(200).json(ordenes);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },
  
    async obtenerPorId(req, res) {
      try {
        const orden = await OrdenesService.obtenerOrdenPorId(
          req.params.id,
          req.user.id
        );
  
        if (!orden) {
          return res.status(404).json({ error: 'Orden no encontrada' });
        }
  
        res.status(200).json(orden);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },
  
    async actualizar(req, res) {
      try {
        const actualizada = await OrdenesService.actualizarOrden(
          req.params.id,
          req.body,
          req.user.id
        );
  
        res.status(200).json({ message: 'Orden actualizada correctamente' });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },
  
    async eliminar(req, res) {
      try {
        await OrdenesService.eliminarOrden(req.params.id, req.user.id);
        res.status(200).json({ message: 'Orden eliminada correctamente' });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  };
  
  module.exports = OrdenesController;