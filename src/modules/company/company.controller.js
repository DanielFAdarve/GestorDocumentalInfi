const CompanyService = require("./company.service");
const Response = require("../models/Response.model");

class CompanyController {
  async create(req, res) {
    const result = await CompanyService.createCompany(req.body);
    if (!result.success) return res.status(400).json(Response.set(400, false, result.message));
    return res.json(Response.set(201, true, result.data));
  }

  async getAll(req, res) {
    const companies = await CompanyService.getAllCompanies();
    return res.json(Response.set(companies));
  }

  async getById(req, res) {
    const result = await CompanyService.getCompanyById(req.params.id);
    if (!result.success) return res.status(404).json(Response.set(404, false, result.message));
    return res.json(Response.set(result.data));
  }

  async update(req, res) {
    const result = await CompanyService.updateCompany(req.params.id, req.body);
    if (!result.success) return res.status(400).json(Response.set(400, false, result.message));
    return res.json(Response.set(200, true, result.data));
  }

  async delete(req, res) {
    const result = await CompanyService.deleteCompany(req.params.id);
    if (!result.success) return res.status(404).json(Response.set(404, false, result.message));
    return res.json(Response.set(200, true, result.message));
  }
}

module.exports = new CompanyController();
