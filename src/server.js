/* const dotenv = require('dotenv');

// Carga las rutas y express
const app = require('./routes.js');
const { sequelize } = require('./models');


dotenv.config();

// Validación del puerto
const port = process.env.PORT || 3000;


async function startServer() {
  try {
    await sequelize.authenticate(); // Verifica conexión
    await sequelize.sync();         // Crea tablas si no existen
    // await sequelize.sync({ force: true }).then(() => {
    // console.log('Base de datos actualizada (alter: true)');
    // });


    console.log('✅ Conexión establecida y tablas sincronizadas.');

    app.listen(port, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
  }
}

startServer(); */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Habilitar CORS
app.use(cors({
  origin: 'http://localhost:4200', // permite tu frontend
  credentials: true
}));

app.use(express.json()); // Para parsear JSON
app.use(express.urlencoded({ extended: true }));

// Aquí cargas tus rutas
const routes = require('./routes.js');
app.use('/api', routes); // ejemplo de prefijo

// Puerto
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
