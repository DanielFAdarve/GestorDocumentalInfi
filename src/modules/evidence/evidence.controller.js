const Response = require('../../core/models/Response.model');

class EvidenceController {
  constructor(evidenceService) {
    this.evidenceService = evidenceService;
  }

  getPendingByContract = async (req, res, next) => {
    try {
      const { id } = req.params;
      const evidences = await this.evidenceService.getPendingEvidences(id);
      res.status(200).json(Response.success('Evidencias obtenidas correctamente', evidences));
    } catch (err) {
      next(err);
    }
  };
}

module.exports = EvidenceController;
