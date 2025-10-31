const express = require('express');
const SupportController = require('./support.controller');

module.exports = (supportService) => {
  const router = express.Router();
  const controller = new SupportController(supportService);

  router.get('/:contractId', controller.listSupports);
  router.post('/upload', controller.uploadSupport);
  router.put('/status/:uploadId', controller.updateStatus);
  router.get('/history/:contractId', controller.getHistory);

  return router;
};
