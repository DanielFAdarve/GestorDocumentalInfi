// src/modules/contract/contract.routes.js
const express = require('express');

module.exports = (contractService) => {
  const router = express.Router();
  const ContractController = require('./contract.controller');
  const controller = new ContractController(contractService);
  
  
  router.get('/filter', controller.filter);
  router.get('/', controller.getAll);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.delete);

  return router;
};
