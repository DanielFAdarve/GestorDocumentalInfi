const { AuditLog } = require('../database');
const { logger } = require('../core/logger');

async function auditMiddleware(req, res, next) {
  // Guardamos el método original de res.send
  const originalSend = res.send;

  res.send = async function (body) {
    try {
      const method = req.method;
      const isWriteOperation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

      if (isWriteOperation) {
        const user = req.user || {}; // <- si luego implementas JWT puedes extraer el usuario aquí
        const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        // Guardar registro
        await AuditLog.create({
          userId: user.id || null,
          userName: user.name || 'Desconocido',
          entity: req.baseUrl.replace('/api/', ''), // ejemplo: contracts, supports
          action: method.toLowerCase(),
          method,
          endpoint: req.originalUrl,
          newValue: typeof body === 'string' ? body : JSON.stringify(body),
          ipAddress,
        });

        logger.info(`📝 Auditoría registrada: [${method}] ${req.originalUrl}`);
      }
    } catch (err) {
      logger.error(`❌ Error registrando auditoría: ${err.message}`);
    }

    // Continuar con el flujo normal
    return originalSend.call(this, body);
  };

  next();
}

module.exports = auditMiddleware;
