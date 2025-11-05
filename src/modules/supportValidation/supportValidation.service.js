// src/modules/supportValidation/supportValidation.service.js
const AppError = require('../../core/errors/AppError');

class SupportValidationService {
  constructor(repository) {
    this.repository = repository;
  }

  async getSupportsForContract(contractId) {
    const data = await this.repository.findResolutionAndSupports(contractId);

    if (!data) throw new AppError('Contrato no encontrado', 404);
    if (!data.resolution)
      throw new AppError('El contrato no tiene una resolución asociada', 400);

    return {
      resolutionId: data.resolution.id,
      resolutionName: data.resolution.resolution_name,
      supports: data.supports,
    };
  }
}

module.exports = SupportValidationService;
