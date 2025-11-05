// src/modules/supportValidation/supportValidation.routes.js
const express = require('express');
const SupportValidationController = require('./supportValidation.controller');

module.exports = (service) => {
  const router = express.Router();
  const controller = new SupportValidationController(service);

  router.get('/:id/supports', controller.getSupportsByContract);

  return router;
};
