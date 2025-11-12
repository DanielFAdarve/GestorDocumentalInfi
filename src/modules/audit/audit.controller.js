const auditService = require('./audit.service');
const Response = require('../../core/models/Response.model');

class AuditController {
  async getAll(req, res) {
    try {
      const data = await auditService.getAll();
      const response = Response.success('Registros de auditoría obtenidos correctamente', data);
      return res.status(response.status).json(response);
    } catch (err) {
      const response = Response.error(err.message, 500);
      return res.status(response.status).json(response);
    }
  }

  async getById(req, res) {
    try {
      const data = await auditService.getById(req.params.id);
      if (!data) {
        const response = Response.error('Registro no encontrado', 404);
        return res.status(response.status).json(response);
      }
      const response = Response.success('Registro obtenido correctamente', data);
      return res.status(response.status).json(response);
    } catch (err) {
      const response = Response.error(err.message, 500);
      return res.status(response.status).json(response);
    }
  }

  async create(req, res) {
    try {
      const data = await auditService.create(req.body);
      const response = Response.success('Registro de auditoría creado correctamente', data, 201);
      return res.status(response.status).json(response);
    } catch (err) {
      const response = Response.error(err.message, 400);
      return res.status(response.status).json(response);
    }
  }

  async delete(req, res) {
    try {
      const deleted = await auditService.delete(req.params.id);
      if (!deleted) {
        const response = Response.error('Registro no encontrado', 404);
        return res.status(response.status).json(response);
      }
      const response = Response.success('Registro eliminado correctamente');
      return res.status(response.status).json(response);
    } catch (err) {
      const response = Response.error(err.message, 500);
      return res.status(response.status).json(response);
    }
  }
}

module.exports = new AuditController();
