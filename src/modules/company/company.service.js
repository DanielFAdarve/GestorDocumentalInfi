const AppError = require('../../core/errors/AppError');

class CompanyService {
  constructor(companyRepository) {
    this.companyRepository = companyRepository;
  }

  async getAllCompanies() {
    return this.companyRepository.findAll();
  }

  async getCompanyById(id) {
    const company = await this.companyRepository.findById(id);
    if (!company) throw new AppError('Empresa no encontrada', 404);
    return company;
  }

  async createCompany(data) {
    const existing = await this.companyRepository.findByName(data.name);
    if (existing) throw new AppError('Ya existe una empresa con este nombre', 400);
    return this.companyRepository.create(data);
  }

  async updateCompany(id, updates) {
    const company = await this.companyRepository.update(id, updates);
    if (!company) throw new AppError('Empresa no encontrada', 404);
    return company;
  }

  async deleteCompany(id) {
    const deleted = await this.companyRepository.delete(id);
    if (!deleted) throw new AppError('Empresa no encontrada', 404);
    return { message: 'Empresa eliminada correctamente' };
  }
}

module.exports = CompanyService;
