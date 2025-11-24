const express = require('express');
const SupportController = require('./supportManager.controller');

module.exports = (supportService) => {
  const router = express.Router();
  const controller = new SupportController(supportService);

  // Generar supports automáticos para un contrato
  router.post('/generate/:contractId', controller.generateForContract);

  // Listar supports de contrato
  router.get('/contract/:contractId', controller.listByContract);

  // Asignar responsable al contract_support
  router.post('/:contractSupportId/assign', controller.assignResponsible);

  // Upload metadata
  router.post('/:contractSupportId/upload', controller.uploadEvidence);

  // Get uploads
  router.get('/:contractSupportId/uploads', controller.getUploads);

  // History
  router.get('/:contractSupportId/history', controller.getHistory);

  // Update contract_support status
  router.patch('/:contractSupportId/status', controller.updateSupportStatus);

  // Update upload portal statuses
  router.patch('/upload/:uploadId/portal-status', controller.updateUploadPortalStatus);

  //Cargar soporte
  router.post('/upload-file/:contractSupportId', controller.uploadEvidenceIntegrate);

  return router;
};
