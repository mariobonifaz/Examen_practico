import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../auth/AuthContext';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

function RegistrarUsuario() {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    password: '',
    esAdmin: false
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirigir si no eres admin
  useEffect(() => {
    if (!usuario?.esAdmin) {
      navigate('/dashboard');
    }
  }, [usuario, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/users/register', form);
      setSuccess('Usuario registrado correctamente');
      setForm({ username: '', password: '', esAdmin: false });
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar usuario');
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 500 }}>
      <h4>Registrar nuevo usuario</h4>
      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="mb-3">
          <label>Usuario</label>
          <input
            className="form-control"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Contraseña</label>
          <input
            className="form-control"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            name="esAdmin"
            id="esAdmin"
            checked={form.esAdmin}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="esAdmin">
            Usuario administrador
          </label>
        </div>

        <button className="btn btn-primary w-100">Registrar</button>
      </form>
    </div>
  );
}

export default RegistrarUsuario;
