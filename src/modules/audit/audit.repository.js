const { AuditLog } = require('../../database');

class AuditRepository {
  async findAll() {
    return await AuditLog.findAll({ order: [['timestamp', 'DESC']] });
  }

  async findById(id) {
    return await AuditLog.findByPk(id);
  }

  async create(data) {
    return await AuditLog.create(data);
  }

  async delete(id) {
    const record = await AuditLog.findByPk(id);
    if (!record) return null;
    await record.destroy();
    return record;
  }
}

module.exports = new AuditRepository();
