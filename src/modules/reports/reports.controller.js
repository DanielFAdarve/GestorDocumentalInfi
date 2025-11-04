const Response = require('../../core/models/Response.model');

class ReportsController {
  constructor(reportsService) {
    this.reportsService = reportsService;
  }

  getObligations = async (req, res, next) => {
    try {
      const { contractId } = req.params;
      const includeAreas = req.query.includeAreas === 'true';
      const xmlData = await this.reportsService.getObligations(contractId, includeAreas);

      res.set('Content-Type', 'application/xml');
      res.status(200).send(xmlData);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = ReportsController;
