const express = require('express');
const CompanyController = require('./company.controller');

module.exports = (companyService) => {
  const router = express.Router();
  const controller = new CompanyController(companyService);

  router.get('/', controller.getAll);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.delete);

  return router;
};
