const RoleService = require('../services/role.service');
const Response = require('../models/Response.model');

class RoleController {
  static async create(req, res, next) {
    try {
      const { name, description } = req.body;

      // Validaciones
      if (!name || typeof name !== 'string' || !name.trim()) {
        return res
          .status(400)
          .json(Response.set(400, false, { error: 'Role name is required and must be a non-empty string' }));
      }

      const role = await RoleService.createRole({ name, description });
      return res.status(201).json(Response.set(role));
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      const roles = await RoleService.getAllRoles();
      return res.json(Response.set(roles));
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json(Response.set(400, false, { error: 'Invalid role ID' }));
      }

      const role = await RoleService.getRoleById(id);

      if (!role) {
        return res.status(404).json(Response.set(404, false, { error: 'Role not found' }));
      }

      return res.json(Response.set(role));
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      if (!id || isNaN(id)) {
        return res.status(400).json(Response.set(400, false, { error: 'Invalid role ID' }));
      }

      if (name && (typeof name !== 'string' || !name.trim())) {
        return res
          .status(400)
          .json(Response.set(400, false, { error: 'Role name must be a non-empty string if provided' }));
      }

      const updatedRole = await RoleService.updateRole(id, { name, description });

      if (!updatedRole) {
        return res.status(404).json(Response.set(404, false, { error: 'Role not found' }));
      }

      return res.json(Response.set(updatedRole));
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json(Response.set(400, false, { error: 'Invalid role ID' }));
      }

      const deleted = await RoleService.deleteRole(id);

      if (!deleted) {
        return res.status(404).json(Response.set(404, false, { error: 'Role not found' }));
      }

      return res.json(Response.set(200, true, { message: 'Role deleted successfully' }));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = RoleController;
