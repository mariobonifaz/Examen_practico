const db = require('./db');
const bcrypt = require('bcrypt');

async function initDB() {
  // Crear tabla Usuarios
  await db.query(`
    CREATE TABLE IF NOT EXISTS Usuarios (
      UsuarioID INT AUTO_INCREMENT PRIMARY KEY,
      Username VARCHAR(100) NOT NULL UNIQUE,
      Password VARCHAR(255) NOT NULL,
      EsAdmin BOOLEAN DEFAULT FALSE
    )
  `);

  // Verificar si ya existe un usuario administrador
  const [rows] = await db.query(`
    SELECT * FROM Usuarios WHERE EsAdmin = true LIMIT 1
  `);

  if (rows.length === 0) {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await db.query(`
      INSERT INTO Usuarios (Username, Password, EsAdmin)
      VALUES (?, ?, ?)
    `, ['admin', hashedPassword, true]);

    console.log('🛠️ Usuario administrador creado: admin / admin123');
  } else {
    console.log('✅ Ya existe un usuario administrador');
  }

  // Crear tabla Estados
await db.query(`
  CREATE TABLE IF NOT EXISTS Estados (
    EstadoID INT AUTO_INCREMENT PRIMARY KEY,
    Estado VARCHAR(100) NOT NULL,
    Activo BOOLEAN DEFAULT TRUE
  )
`);

  // Crear tabla Municipios
  await db.query(`
    CREATE TABLE IF NOT EXISTS Municipios (
      MunicipioID INT AUTO_INCREMENT PRIMARY KEY,
      EstadoID INT NOT NULL,
      Municipio VARCHAR(100) NOT NULL,
      Activo BOOLEAN DEFAULT TRUE,
      FOREIGN KEY (EstadoID) REFERENCES Estados(EstadoID)
    )
  `);

  // Insertar estado y municipios si están vacíos
  const [estados] = await db.query(`SELECT * FROM Estados LIMIT 1`);
  if (estados.length === 0) {
    // Insertar 2 estados de ejemplo
    await db.query(`INSERT INTO Estados (Estado) VALUES (?), (?)`, [
      'Chiapas',
      'Jalisco'
    ]);

    const [insertedStates] = await db.query(`SELECT * FROM Estados`);

    for (const estado of insertedStates) {
      if (estado.Estado === 'Chiapas') {
        await db.query(`
          INSERT INTO Municipios (EstadoID, Municipio) VALUES
          (?, 'Tuxtla Gutiérrez'),
          (?, 'San Cristóbal de las Casas'),
          (?, 'Comitán de Domínguez')
        `, [estado.EstadoID, estado.EstadoID, estado.EstadoID]);
      } else if (estado.Estado === 'Jalisco') {
        await db.query(`
          INSERT INTO Municipios (EstadoID, Municipio) VALUES
          (?, 'Guadalajara'),
          (?, 'Zapopan')
        `, [estado.EstadoID, estado.EstadoID]);
      }
    }

    console.log('🌍 Estados y municipios insertados');
  }

  await db.query(`
  CREATE TABLE IF NOT EXISTS ORDENESESERVICIO (
    OrdenServicioID INT AUTO_INCREMENT PRIMARY KEY,
    MunicipioID INT NOT NULL,
    Colonia VARCHAR(100),
    NumExterior VARCHAR(20),
    Domicilio VARCHAR(150),
    EntreCalles VARCHAR(150),
    FechaInicial DATE NOT NULL,
    FechaFinal DATE NOT NULL,
    Activo BOOLEAN DEFAULT TRUE,
    UsuarioCreo INT NOT NULL,
    FechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MunicipioID) REFERENCES Municipios(MunicipioID),
    FOREIGN KEY (UsuarioCreo) REFERENCES Usuarios(UsuarioID)
    )
  `);

  console.log('Tablas inicializadas correctamente ✅');
}

module.exports = initDB;