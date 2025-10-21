class CompanyRepository {
  constructor(CompanyModel) {
    this.Company = CompanyModel;
  }

  async findAll() {
    return this.Company.findAll();
  }

  async findById(id) {
    return this.Company.findByPk(id);
  }

  async findByName(name) {
    return this.Company.findOne({ where: { name } });
  }

  async create(data) {
    return this.Company.create(data);
  }

  async update(id, updates) {
    const company = await this.findById(id);
    if (!company) return null;
    return company.update(updates);
  }

  async delete(id) {
    const company = await this.findById(id);
    if (!company) return null;
    await company.destroy();
    return true;
  }
}

module.exports = CompanyRepository;
