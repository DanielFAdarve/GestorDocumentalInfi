const { createCompanySchema, updateCompanySchema } = require('./company.schema');

class CompanyController {
  constructor(companyService) {
    this.companyService = companyService;
  }

  getAll = async (req, res, next) => {
    try {
      const companies = await this.companyService.getAllCompanies();
      res.status(200).json(companies);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req, res, next) => {
    try {
      const company = await this.companyService.getCompanyById(req.params.id);
      res.status(200).json(company);
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const validated = createCompanySchema.parse(req.body);
      const company = await this.companyService.createCompany(validated);
      res.status(201).json(company);
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      const validated = updateCompanySchema.parse(req.body);
      const company = await this.companyService.updateCompany(req.params.id, validated);
      res.status(200).json(company);
    } catch (err) {
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const result = await this.companyService.deleteCompany(req.params.id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = CompanyController;
