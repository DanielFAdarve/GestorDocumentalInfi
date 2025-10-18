const Response = require('../database/models/Response.model');

function errorHandler(err, req, res, next) {
  console.error('Error capturado por middleware:', err);

  const statusCode = err.status || 500;

  let message = 'Internal Server Error';

  if (err.name === 'SequelizeValidationError') {
    message = 'Validation error: ' + err.errors.map(e => e.message).join(', ');
  } else if (err.name === 'SequelizeForeignKeyConstraintError') {
    message = 'Foreign key constraint failed (relación inexistente o inválida)';
  } else if (err.name === 'SequelizeUniqueConstraintError') {
    message = 'Duplicate entry: ' + err.errors.map(e => e.message).join(', ');
  } else if (err.message) {
    message = err.message;
  }

  res.status(statusCode).json(
    Response.set(statusCode, false, { error: message })
  );
}

module.exports = errorHandler;
