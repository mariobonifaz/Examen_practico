import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../auth/AuthContext';

function EditarOrden() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const [estados, setEstados] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('');
  const [formData, setFormData] = useState({
    MunicipioID: '',
    Colonia: '',
    NumExterior: '',
    Domicilio: '',
    EntreCalles: '',
    FechaInicial: '',
    FechaFinal: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Cargar estados al iniciar
  useEffect(() => {
    const cargarEstados = async () => {
      try {
        const res = await api.get('/estados');
        setEstados(res.data);
      } catch {
        setError('Error al cargar estados');
      }
    };
    cargarEstados();
  }, []);

  // Cargar datos de la orden
  useEffect(() => {
    const cargarOrden = async () => {
      try {
        const res = await api.get(`/ordenes/${id}`);
        const orden = res.data;

        // 1. Set EstadoID
        setEstadoSeleccionado(orden.EstadoID);

        // 2. Cargar municipios del Estado
        const municipiosRes = await api.get(`/municipios/${orden.EstadoID}`);
        setMunicipios(municipiosRes.data);

        // 3. Set resto de los datos
        setFormData({
          MunicipioID: orden.MunicipioID,
          Colonia: orden.Colonia,
          NumExterior: orden.NumExterior,
          Domicilio: orden.Domicilio,
          EntreCalles: orden.EntreCalles,
          FechaInicial: orden.FechaInicial.split('T')[0],
          FechaFinal: orden.FechaFinal.split('T')[0]
        });
      } catch (err) {
        if (err.response?.status === 401) logout();
        else setError('No se pudo cargar la orden');
      }
    };

    cargarOrden();
  }, [id, logout]);

  // Cuando cambia el estado manualmente, actualizar municipios
  useEffect(() => {
    if (!estadoSeleccionado) return;

    const cargarMunicipios = async () => {
      try {
        const res = await api.get(`/municipios/${estadoSeleccionado}`);
        setMunicipios(res.data);
      } catch {
        setError('Error al cargar municipios');
      }
    };

    cargarMunicipios();
  }, [estadoSeleccionado]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.put(`/ordenes/${id}`, formData);
      setSuccess('Orden actualizada correctamente');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al actualizar');
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 600 }}>
      <h4>Editar Orden</h4>
      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="mb-3">
          <label>Estado</label>
          <select
            className="form-select"
            value={estadoSeleccionado}
            onChange={(e) => {
              const nuevoEstado = e.target.value;
              setEstadoSeleccionado(nuevoEstado);
              setFormData((f) => ({ ...f, MunicipioID: '' }));
            }}
            required
          >
            <option value="">Selecciona un estado</option>
            {estados.map((e) => (
              <option key={e.EstadoID} value={e.EstadoID}>
                {e.Estado}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Municipio</label>
          <select
            className="form-select"
            name="MunicipioID"
            value={formData.MunicipioID}
            onChange={handleChange}
            required
            disabled={!estadoSeleccionado}
          >
            <option value="">Selecciona un municipio</option>
            {municipios.map((m) => (
              <option key={m.MunicipioID} value={m.MunicipioID}>
                {m.Municipio}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-2">
          <label>Domicilio</label>
          <input className="form-control" name="Domicilio" value={formData.Domicilio} onChange={handleChange} required />
        </div>

        <div className="mb-2">
          <label>Número Exterior</label>
          <input className="form-control" name="NumExterior" value={formData.NumExterior} onChange={handleChange} />
        </div>

        <div className="mb-2">
          <label>Colonia</label>
          <input className="form-control" name="Colonia" value={formData.Colonia} onChange={handleChange} />
        </div>

        <div className="mb-2">
          <label>Entre Calles</label>
          <input className="form-control" name="EntreCalles" value={formData.EntreCalles} onChange={handleChange} />
        </div>

        <div className="mb-2">
          <label>Fecha Inicial</label>
          <input type="date" className="form-control" name="FechaInicial" value={formData.FechaInicial} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label>Fecha Final</label>
          <input type="date" className="form-control" name="FechaFinal" value={formData.FechaFinal} onChange={handleChange} required />
        </div>

        <button className="btn btn-success w-100">Guardar Cambios</button>
      </form>
    </div>
  );
}

export default EditarOrden;
