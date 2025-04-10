// middleware/auth.js
const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) return res.status(401).json({ error: 'Token no proporcionado' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
}

function soloAdmin(req, res, next) {
  if (!req.user?.esAdmin) {
    return res.status(403).json({ error: 'Solo administradores pueden realizar esta acción' });
  }
  next();
}

module.exports = { verificarToken, soloAdmin };
