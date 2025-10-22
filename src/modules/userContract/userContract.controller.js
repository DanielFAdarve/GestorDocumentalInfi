// controllers/userContractRoleController.js
const { successResponse } = require('../utils/responses');

class UserContractRoleController {
  constructor(userContractRoleService) {
    this.userContractRoleService = userContractRoleService;
  }

  create = async (req, res, next) => {
    try {
      const data = await this.userContractRoleService.create(req.body);
      successResponse(res, data, 'Relación creada correctamente');
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req, res, next) => {
    try {
      const data = await this.userContractRoleService.getAll();
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req, res, next) => {
    try {
      const data = await this.userContractRoleService.getById(req.params.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const data = await this.userContractRoleService.update(req.params.id, req.body);
      successResponse(res, data, 'Relación actualizada correctamente');
    } catch (error) {
      next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      await this.userContractRoleService.delete(req.params.id);
      successResponse(res, null, 'Relación eliminada correctamente');
    } catch (error) {
      next(error);
    }
  };
}

module.exports = UserContractRoleController;
