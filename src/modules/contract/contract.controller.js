const { createContractSchema, updateContractSchema } = require('./contract.schema');
const Response = require('../../core/models/Response.model');

class ContractController {
  constructor(contractService) {
    this.contractService = contractService;
  }

  // Obtener todos los contratos
  getAll = async (req, res, next) => {
    try {
      const contracts = await this.contractService.getAllContracts();
      res
        .status(200)
        .json(Response.success('Contratos obtenidos correctamente', contracts));
    } catch (err) {
      next(err);
    }
  };

  // Obtener contrato por ID
  getById = async (req, res, next) => {
    try {
      const contract = await this.contractService.getContractById(req.params.id);
      if (!contract) {
        return res
          .status(404)
          .json(Response.error('Contrato no encontrado', 404));
      }
      res
        .status(200)
        .json(Response.success('Contrato obtenido correctamente', contract));
    } catch (err) {
      next(err);
    }
  };

    // Obtener contrato por ID
  getByCompany = async (req, res, next) => {
    try {
      const contract = await this.contractService.getContractByCompanyId(req.params.id);
      if (!contract) {
        return res
          .status(404)
          .json(Response.error('Contrato no encontrado', 404));
      }
      res
        .status(200)
        .json(Response.success('Contrato obtenido correctamente', contract));
    } catch (err) {
      next(err);
    }
  };
  // Crear contrato
  create = async (req, res, next) => {
    try {
      const validated = createContractSchema.parse(req.body);
      const contract = await this.contractService.createContract(validated);
      res
        .status(201)
        .json(Response.success('Contrato creado correctamente', contract, 201));
    } catch (err) {
      next(err);
    }
  };

  // Actualizar contrato
  update = async (req, res, next) => {
    try {
      const validated = updateContractSchema.parse(req.body);
      const updated = await this.contractService.updateContract(
        req.params.id,
        validated
      );

      if (!updated) {
        return res
          .status(404)
          .json(Response.error('Contrato no encontrado', 404));
      }

      res
        .status(200)
        .json(Response.success('Contrato actualizado correctamente', updated));
    } catch (err) {
      next(err);
    }
  };

  // Eliminar contrato
  delete = async (req, res, next) => {
    try {
      const result = await this.contractService.deleteContract(req.params.id);

      if (!result) {
        return res
          .status(404)
          .json(Response.error('Contrato no encontrado', 404));
      }

      res
        .status(200)
        .json(Response.success('Contrato eliminado correctamente', result));
    } catch (err) {
      next(err);
    }
  };

  // Filtrar contratos dinámicamente
  filter = async (req, res, next) => {
    try {
      const { field, value } = req.query;

      if (!field || !value) {
        return res
          .status(400)
          .json(
            Response.error(
              'Debe proporcionar field y value como query params',
              400
            )
          );
      }
      const result = await this.contractService.filterContracts(field, value);

      if (!result || result.length === 0) {
        return res
          .status(404)
          .json(
            Response.error(
              'No se encontraron contratos con los criterios especificados',
              404
            )
          );
      }

      res
        .status(200)
        .json(Response.success('Contratos filtrados correctamente', result));
    } catch (err) {
      next(err);
    }
  };
}

module.exports = ContractController;
