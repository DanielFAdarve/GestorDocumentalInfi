// Importar Express y middlewares
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/errorHandler.middleware');

// Cargar Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger/swagger');

// Importar nuestras rutas principales
const apiRoutes = require('./routes/index'); 

const app = express();

// Configuración de CORS
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:4200'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true
}));

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Swagger Docs 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use('/api', apiRoutes);

// Middleware de manejo de errores 
app.use(errorHandler);

module.exports = app;
