require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./database');
const {logger} = require('./core/logger');

const PORT = process.env.PORT || 3000;

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    logger.info('✅ Conexión a la base de datos establecida.');
    // await sequelize.sync({ force: true }); 
    logger.info('🗄️  Tablas sincronizadas correctamente.');
  } catch (error) {
    logger.error('❌ Error en la sincronización de base de datos:', error);
    process.exit(1);
  }
}

async function startServer() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => logger.info(`🚀 Servidor escuchando en http://localhost:${PORT}`));
  } catch (error) {
    logger.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

startServer();
