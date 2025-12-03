const { Router } = require('express');
const ContractController = require('./contract.controller');

module.exports = function contractsRoutes(contractService) {
  const router = Router();
  const controller = new ContractController(contractService);

  // CRUD
  router.get('/', controller.getAll);
  router.get('/company/:id', controller.getByCompany);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.delete);

  // Filtro dinámico
  router.get('/filter', controller.filter);

  // REPORTES
  router.get('/report/general', controller.reportGeneral);
  router.get('/report/id/:id', controller.reportById);
  router.get('/report/status/:status', controller.reportByStatus);
  router.get('/report/dependency/:dependency', controller.reportByDependency);
  router.get('/report/near', controller.reportNearToExpire);
  router.get('/report/expired', controller.reportExpired);

  return router;
};