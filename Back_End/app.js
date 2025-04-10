const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
const userRoutes = require('./routes/User_Routes');
app.use('/api/users', userRoutes);

const ordenesRoutes = require('./routes/Orders_Routes');
app.use('/api/ordenes', ordenesRoutes);

const catalogoRoutes = require('./routes/Est_mun_Routes');
app.use('/api', catalogoRoutes);


module.exports = app;
