require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./database');
const app = require('./routes');

const PORT = process.env.PORT || 3000;

async function initializeDatabase() {
  try {
    // Verifica conexión
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida.');

    // Sincroniza modelos (puedes cambiar force:true por alter:true en desarrollo)
    await sequelize.sync({ force: true });
    console.log('🗄️  Tablas sincronizadas correctamente.');
  } catch (error) {
    console.error('❌ Error en la sincronización de base de datos:', error);
    process.exit(1);
  }
}

async function startServer() {
  try {
    // Inicializa middleware
    const server = express();

    server.use(cors({ origin: 'http://localhost:4200', credentials: true }));
    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));

    // Cargar rutas
    server.use('/api', app);

    // Inicializar DB
    await initializeDatabase();

    // Iniciar servidor
    server.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
  }
}

startServer();
