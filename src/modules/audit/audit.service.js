const auditRepository = require('./audit.repository');
const { logger } = require('../../core/logger');

class AuditService {
  async getAll() {
    return await auditRepository.findAll();
  }

  async getById(id) {
    const log = await auditRepository.findById(id);
    if (!log) throw new Error('Registro de auditoría no encontrado');
    return log;
  }

  async create(data) {
    const log = await auditRepository.create(data);
    logger.info(`📝 Auditoría creada para entidad ${data.entity}`);
    return log;
  }

  async delete(id) {
    const deleted = await auditRepository.delete(id);
    if (!deleted) throw new Error('No se encontró el registro para eliminar');
    logger.info(`🗑️ Auditoría eliminada ID ${id}`);
    return deleted;
  }
}

module.exports = new AuditService();
