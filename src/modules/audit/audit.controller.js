const auditService = require('./audit.service');
const { successResponse, errorResponse } = require('../../core/models/Response.model');

class AuditController {
  async getAll(req, res) {
    try {
      const data = await auditService.getAll();
      return successResponse(res, data, 'Registros de auditoría obtenidos correctamente');
    } catch (err) {
      return errorResponse(res, err.message);
    }
  }

  async getById(req, res) {
    try {
      const data = await auditService.getById(req.params.id);
      return successResponse(res, data, 'Registro obtenido correctamente');
    } catch (err) {
      return errorResponse(res, err.message);
    }
  }

  async create(req, res) {
    try {
      const data = await auditService.create(req.body);
      return successResponse(res, data, 'Registro de auditoría creado correctamente');
    } catch (err) {
      return errorResponse(res, err.message);
    }
  }

  async delete(req, res) {
    try {
      const data = await auditService.delete(req.params.id);
      return successResponse(res, data, 'Registro eliminado correctamente');
    } catch (err) {
      return errorResponse(res, err.message);
    }
  }
}

module.exports = new AuditController();
