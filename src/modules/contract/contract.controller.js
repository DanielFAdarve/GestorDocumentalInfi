const { createContractSchema, updateContractSchema } = require('./contract.schema');

class ContractController {
  constructor(contractService) {
    this.contractService = contractService;
  }

  getAll = async (req, res, next) => {
    try {
      const contracts = await this.contractService.getAllContracts();
      res.status(200).json(contracts);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req, res, next) => {
    try {
      const contract = await this.contractService.getContractById(req.params.id);
      res.status(200).json(contract);
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const validated = createContractSchema.parse(req.body);
      const contract = await this.contractService.createContract(validated);
      res.status(201).json(contract);
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      const validated = updateContractSchema.parse(req.body);
      const contract = await this.contractService.updateContract(req.params.id, validated);
      res.status(200).json(contract);
    } catch (err) {
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const result = await this.contractService.deleteContract(req.params.id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = ContractController;
