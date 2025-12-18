const Response = require('../../core/models/Response.model');

class ReportController {
  constructor(reportService) {
    this.service = reportService;
  }

  // GET /reports/contracts-compliance
  getContractsCompliance = async (req, res, next) => {
    try {
      const result = await this.service.getContractsCompliance();
      return res
        .status(200)
        .json(Response.success('Reporte de cumplimiento contractual', result));
    } catch (err) {
      next(err);
    }
  };
  getContractsSupportsCompliance = async (req, res, next) => {
  try {
    const result = await this.service.getContractsSupportsCompliance();
    return res
      .status(200)
      .json(Response.success(
        'Reporte de cumplimiento por soporte',
        result
      ));
  } catch (err) {
    next(err);
  }
};

}

module.exports = ReportController;