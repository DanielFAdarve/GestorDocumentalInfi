// src/modules/contract/contract.controller.js

class ContractController {
  constructor(contractService) {
    this.contractService = contractService;
  }

  getAll = async (req, res, next) => {
    try {
      const data = await this.contractService.getAll();
      res.json(data);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req, res, next) => {
    try {
      const data = await this.contractService.getById(req.params.id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const data = await this.contractService.createContract(req.body);
      res.status(201).json(data);
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      await this.contractService.updateContract(req.params.id, req.body);
      res.json({ message: "Contrato actualizado" });
    } catch (err) {
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      await this.contractService.deleteContract(req.params.id);
      res.json({ message: "Contrato eliminado" });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = ContractController;
