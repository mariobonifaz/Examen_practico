import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/Dashboard';
import CrearOrden from './pages/crearOrdenes';
import { AuthProvider } from './auth/AuthContext';
import RegistrarUsuario from './pages/RegistrarUsuario';
import EditarOrden from './pages/editarOrden';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/nueva-orden" element={<CrearOrden />} />
          <Route path="/registrar-usuario" element={<RegistrarUsuario />} />
          <Route path="/ordenes/:id/editar" element={<EditarOrden />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
