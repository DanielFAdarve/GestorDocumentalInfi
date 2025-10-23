const { createUserContractRoleSchema, updateUserContractRoleSchema } = require('./userContract.schema');

class UserContractRoleController {
  constructor(userContractRoleService) {
    this.userContractRoleService = userContractRoleService;
  }

  getAll = async (req, res, next) => {
    try {
      const roles = await this.userContractRoleService.getAllUserContractRoles();
      res.status(200).json(roles);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req, res, next) => {
    try {
      const role = await this.userContractRoleService.getUserContractRoleById(req.params.id);
      res.status(200).json(role);
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const validated = createUserContractRoleSchema.parse(req.body);
      const newRole = await this.userContractRoleService.createUserContractRole(validated);
      res.status(201).json(newRole);
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      const validated = updateUserContractRoleSchema.parse(req.body);
      const updated = await this.userContractRoleService.updateUserContractRole(req.params.id, validated);
      res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const result = await this.userContractRoleService.deleteUserContractRole(req.params.id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = UserContractRoleController;
