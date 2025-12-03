const Response = require('../../core/models/Response.model');

class ContractController {
  constructor(contractService) {
    this.contractService = contractService;
  }

  getAll = async (req, res, next) => {
    try {
      const result = await this.contractService.getAll();
      if (!result.success) {
        return res.status(400).json(Response.error(result.message));
      }
      res.status(200).json(Response.success('Contratos obtenidos correctamente', result.data));
    } catch (err) {
      next(err);
    }
  };

  getById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await this.contractService.getById(id);

      if (!result.success) {
        return res.status(404).json(Response.error(result.message));
      }
      res.status(200).json(Response.success('Contrato obtenido correctamente', result.data));
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const result = await this.contractService.createContract(req.body);

      if (!result.success) {
        return res.status(400).json(Response.error(result.message));
      }
      res.status(201).json(Response.success('Contrato creado correctamente', result.data));
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await this.contractService.updateContract(id, req.body);

      if (!result.success) {
        return res.status(400).json(Response.error(result.message));
      }
      res.status(200).json(Response.success('Contrato actualizado correctamente', result.data));
    } catch (err) {
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await this.contractService.deleteContract(id);

      if (!result.success) {
        return res.status(404).json(Response.error(result.message));
      }
      res.status(200).json(Response.success('Contrato eliminado correctamente', null));
    } catch (err) {
      next(err);
    }
  };

  filter = async (req, res, next) => {
    try {
      const { field, value } = req.query;
      const result = await this.contractService.filter(field, value);

      if (!result.success) {
        return res.status(400).json(Response.error(result.message));
      }
      res.status(200).json(Response.success('Filtros aplicados correctamente', result.data));
    } catch (err) {
      next(err);
    }
  };
}

module.exports = ContractController;
