const Company = require("../models/company.model");

class CompanyService {
  async createCompany(data) {
    try {
      if (!data.name || !data.name.trim())
        return { success: false, message: "Company name is required" };

      if (!data.tax_id || typeof data.tax_id !== "number")
        return { success: false, message: "Valid tax_id (number) is required" };

      const exists = await Company.findOne({ where: { tax_id: data.tax_id } });
      if (exists) return { success: false, message: "Company with this tax_id already exists" };

      const company = await Company.create(data);
      return { success: true, data: company };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  async getAllCompanies() {
    return await Company.findAll();
  }

  async getCompanyById(id) {
    const company = await Company.findByPk(id);
    if (!company) return { success: false, message: "Company not found" };
    return { success: true, data: company };
  }

  async updateCompany(id, data) {
    const company = await Company.findByPk(id);
    if (!company) return { success: false, message: "Company not found" };

    if (data.tax_id) {
      const exists = await Company.findOne({ where: { tax_id: data.tax_id } });
      if (exists && exists.id !== id)
        return { success: false, message: "Another company with this tax_id already exists" };
    }

    await company.update(data);
    return { success: true, data: company };
  }

  async deleteCompany(id) {
    const company = await Company.findByPk(id);
    if (!company) return { success: false, message: "Company not found" };

    await company.destroy();
    return { success: true, message: "Company deleted" };
  }
}

module.exports = new CompanyService();
