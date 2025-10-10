const UserCompanyService = require("../services/userCompany.service");
const Response = require("../models/Response.model");

class UserCompanyController {
  async add(req, res) {
    const result = await UserCompanyService.addUserToCompany(req.body);
    if (!result.success) return res.status(400).json(Response.set(400, false, result.message));
    return res.json(Response.set(201, true, result.data));
  }

  async getCompanies(req, res) {
    const result = await UserCompanyService.getCompaniesByUser(req.params.userId);
    if (!result.success) return res.status(404).json(Response.set(404, false, result.message));
    return res.json(Response.set(result.data));
  }

  async getUsers(req, res) {
    const result = await UserCompanyService.getUsersByCompany(req.params.companyId);
    if (!result.success) return res.status(404).json(Response.set(404, false, result.message));
    return res.json(Response.set(result.data));
  }

  async getAllUserCompanies(req, res) {
    const relations = await UserCompanyService.getAll(); // necesitas implementarlo
    return res.json(Response.set(200, true, relations));
  }

  async remove(req, res) {
    const result = await UserCompanyService.removeUserFromCompany(req.params.userId, req.params.companyId);
    if (!result.success) return res.status(404).json(Response.set(404, false, result.message));
    return res.json(Response.set(200, true, result.message));
  }
}

module.exports = new UserCompanyController();
