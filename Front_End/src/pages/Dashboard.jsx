import React, { useContext, useEffect, useState } from 'react';
import api from '../api/axios';
import { AuthContext } from '../auth/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function Dashboard() {
  const { usuario, logout } = useContext(AuthContext);
  const [ordenes, setOrdenes] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const cargarOrdenes = async () => {
      try {
        const res = await api.get('/ordenes');
        setOrdenes(res.data);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          logout();
          navigate('/');
        } else {
          setError('Error al cargar órdenes');
        }
      }
    };

    cargarOrdenes();
  }, [logout, navigate]);

  const handleEliminar = async (id) => {
    const confirmar = window.confirm('¿Estás seguro de eliminar esta orden?');
    if (!confirmar) return;
  
    try {
      await api.delete(`/ordenes/${id}`);
      setOrdenes((prev) => prev.filter((o) => o.OrdenServicioID !== id));
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Hubo un error al eliminar la orden.');
    }
  };  

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Órdenes de servicio</h4>
        <div>
          <span className="me-3">Usuario: {usuario?.username}</span>

          {usuario?.esAdmin && (
            <Link to="/registrar-usuario" className="btn btn-outline-secondary btn-sm me-2">
            Registrar Usuario
            </Link>
          )}

          <button className="btn btn-outline-danger btn-sm" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </div>

      <Link to="/nueva-orden" className="btn btn-primary mb-3">
        + Nueva Orden
      </Link>

      {error && <div className="alert alert-danger">{error}</div>}

      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Municipio</th>
            <th>Domicilio</th>
            <th>Colonia</th>
            <th>Fechas</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ordenes.map((orden) => (
            <tr key={orden.OrdenServicioID}>
              <td>{orden.OrdenServicioID}</td>
              <td>{orden.MunicipioID}</td>
              <td>{orden.Domicilio}</td>
              <td>{orden.Colonia}</td>
              <td>
                {orden.FechaInicial} → {orden.FechaFinal}
              </td>
              <td>{orden.Activo ? 'Sí' : 'No'}</td>
              <td>
              <button
                className="btn btn-sm btn-warning me-2"
                onClick={() => navigate(`/ordenes/${orden.OrdenServicioID}/editar`)}
              >
                ✏️
              </button>
                      
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleEliminar(orden.OrdenServicioID)}
              >
                🗑️
              </button>
            </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
