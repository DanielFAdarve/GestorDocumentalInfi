const ContractService = require("./contract.service");
const Response = require("../models/Response.model");

class ContractController {
  async create(req, res) {
    const result = await ContractService.createContract(req.body);
    if (!result.success) return res.status(400).json(Response.set(400, false, result.message));
    return res.json(Response.set(201, true, result.data));
  }

  async getAll(req, res) {
    const contracts = await ContractService.getAllContracts();
    return res.json(Response.set(contracts));
  }

  async getById(req, res) {
    const result = await ContractService.getContractById(req.params.id);
    if (!result.success) return res.status(404).json(Response.set(404, false, result.message));
    return res.json(Response.set(result.data));
  }

  async update(req, res) {
    const result = await ContractService.updateContract(req.params.id, req.body);
    if (!result.success) return res.status(400).json(Response.set(400, false, result.message));
    return res.json(Response.set(200, true, result.data));
  }

  async delete(req, res) {
    const result = await ContractService.deleteContract(req.params.id);
    if (!result.success) return res.status(404).json(Response.set(404, false, result.message));
    return res.json(Response.set(200, true, result.message));
  }
}

module.exports = new ContractController();
