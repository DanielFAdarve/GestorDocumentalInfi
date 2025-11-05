// src/modules/supportValidation/supportValidation.controller.js
const Response = require('../../core/models/Response.model');

class SupportValidationController {
  constructor(service) {
    this.service = service;
  }

  getSupportsByContract = async (req, res, next) => {
    try {
      const { id } = req.params;
      const supports = await this.service.getSupportsForContract(id);

      res
        .status(200)
        .json(Response.success('Soportes asociados a la resolución obtenidos correctamente', supports));
    } catch (err) {
      next(err);
    }
  };
}

module.exports = SupportValidationController;
