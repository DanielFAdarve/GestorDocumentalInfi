const AppError = require('./AppError');
const { ZodError } = require('zod');

function errorHandler(err, req, res, next) {
  console.error(`[ErrorHandler]`, err);

  // Errores de validación (Zod)
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      message: 'Datos inválidos',
      details: err.errors.map(e => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  // Errores controlados
  if (err instanceof AppError && err.isOperational) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      details: err.details || null,
    });
  }

  // Errores no controlados
  return res.status(500).json({
    status: 'error',
    message: 'Error interno del servidor',
  });
}

module.exports = errorHandler;
