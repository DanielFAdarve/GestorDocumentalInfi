const express = require('express');
const EvidenceController = require('./evidence.controller');

module.exports = (evidenceService) => {
  const router = express.Router();
  const controller = new EvidenceController(evidenceService);

  // GET /api/contracts/:id/evidences/pending
  router.get('/contracts/:id/pending', controller.getPendingByContract);

  return router;
};
