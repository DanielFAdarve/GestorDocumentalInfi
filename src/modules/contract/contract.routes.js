const express = require('express');
const ContractController = require('./contract.controller');

module.exports = (contractService) => {
  const router = express.Router();
  const controller = new ContractController(contractService);

  router.get('/', controller.getAll);
  router.get('/filter', controller.filter);
  router.get('/company/:id', controller.getByCompany);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.delete);


  return router;
};
