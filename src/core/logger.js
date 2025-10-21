const path = require('path');
const morgan = require('morgan');
const winston = require('winston');

const { createLogger, format, transports } = winston;
const { combine, timestamp, printf, colorize, errors } = format;

// ========================================================
// 🎨 FORMATO PERSONALIZADO DE LOG
// ========================================================
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}] ${stack || message}`;
});

// ========================================================
// 🔧 CONFIGURACIÓN DE NIVELES Y COLORES
// ========================================================
const customLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const customColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

winston.addColors(customColors);

// ========================================================
// 🧠 CREACIÓN DEL LOGGER PRINCIPAL
// ========================================================
const logger = createLogger({
  levels: customLevels,
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: path.join(__dirname, '../../logs/app.log'),
      level: 'info',
    }),
    new transports.File({
      filename: path.join(__dirname, '../../logs/error.log'),
      level: 'error',
    }),
  ],
  exitOnError: false,
});

// ========================================================
// 📜 INTEGRACIÓN CON MORGAN (HTTP LOGGING)
// ========================================================
const morganStream = {
  write: (message) => logger.http(message.trim()),
};

const httpLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  { stream: morganStream }
);

// ========================================================
// 🔒 EXPORTACIÓN
// ========================================================
module.exports = { logger, httpLogger };
