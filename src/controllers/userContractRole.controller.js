const UserContractRoleService = require("../services/userContractRole.service");
const Response = require("../models/Response.model");

class UserContractRoleController {
  async assign(req, res) {
    const result = await UserContractRoleService.assignRoleToUser(req.body);
    if (!result.success) return res.status(400).json(Response.set(400, false, result.message));
    return res.json(Response.set(201, true, result.data));
  }

  async getRoles(req, res) {
    const result = await UserContractRoleService.getRolesByUser(req.params.userId);
    if (!result.success) return res.status(404).json(Response.set(404, false, result.message));
    return res.json(Response.set(result.data));
  }

  async getUsers(req, res) {
    const result = await UserContractRoleService.getUsersByContract(req.params.contractId);
    if (!result.success) return res.status(404).json(Response.set(404, false, result.message));
    return res.json(Response.set(result.data));
  }

  async update(req, res) {
    const result = await UserContractRoleService.updateUserRole(req.params.userId, req.params.contractId, req.body.role);
    if (!result.success) return res.status(400).json(Response.set(400, false, result.message));
    return res.json(Response.set(200, true, result.data));
  }

  async remove(req, res) {
    const result = await UserContractRoleService.removeUserRole(req.params.userId, req.params.contractId);
    if (!result.success) return res.status(404).json(Response.set(404, false, result.message));
    return res.json(Response.set(200, true, result.message));
  }
}

module.exports = new UserContractRoleController();
