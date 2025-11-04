const express = require('express');
const ReportsController = require('./reports.controller');

module.exports = (reportsService) => {
  const router = express.Router();
  const controller = new ReportsController(reportsService);

  router.get('/contracts/:contractId/obligations', controller.getObligations);

  return router;
};
