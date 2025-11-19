/**
 * 🌐 Aplicación principal
 * Configura middlewares globales, CORS, Swagger, rutas y manejo centralizado de errores.
 */

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger');
const apiRoutes = require('./routes');
const errorHandler = require('./core/errors/errorHandler');
const AppError = require('./core/errors/AppError');
const { httpLogger, logger } = require('./core/logger');

const app = express();

// ========================================================
// 🌍 CONFIGURACIÓN DE CORS
// ========================================================
const allowedOrigins = ['http://localhost:3000', 'http://localhost:4200','https://lemon-desert-055e31c10.3.azurestaticapps.net'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new AppError('Origen no permitido por CORS', 403));
      }
    },
    credentials: true,
  })
);

// ========================================================
// 🧩 MIDDLEWARES GLOBALES
// ========================================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(httpLogger); // Morgan + Winston

const auditMiddleware = require('./middlewares/audit.middleware');
app.use(auditMiddleware);

// ========================================================
// 📘 DOCUMENTACIÓN SWAGGER
// ========================================================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ========================================================
// 🚏 RUTAS PRINCIPALES
// ========================================================
// app.use('/', apiRoutes);
app.use('/api', apiRoutes);

// ========================================================
// ❌ MANEJO DE RUTA INEXISTENTE
// ========================================================
app.use((req, res, next) => {
  next(new AppError(`Ruta no encontrada: ${req.originalUrl}`, 404));
});

// ========================================================
// 🧱 MANEJADOR GLOBAL DE ERRORES
// ========================================================
app.use(errorHandler);

module.exports = app;
