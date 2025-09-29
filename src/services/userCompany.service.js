const UserCompany = require("../models/userCompany.model");
const User = require("../models/user.model");
const Company = require("../models/company.model");

class UserCompanyService {
  async addUserToCompany(data) {
    try {
      if (!data.user_id || !data.company_id)
        return { success: false, message: "user_id and company_id are required" };

      // Validar existencia de usuario
      const user = await User.findByPk(data.user_id);
      if (!user) return { success: false, message: "User not found" };

      // Validar existencia de empresa
      const company = await Company.findByPk(data.company_id);
      if (!company) return { success: false, message: "Company not found" };

      // Evitar duplicados
      const exists = await UserCompany.findOne({
        where: { user_id: data.user_id, company_id: data.company_id },
      });
      if (exists) return { success: false, message: "User already belongs to this company" };

      const relation = await UserCompany.create(data);
      return { success: true, data: relation };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  async getCompaniesByUser(userId) {
    const user = await User.findByPk(userId, { include: Company });
    if (!user) return { success: false, message: "User not found" };
    return { success: true, data: user.Companies };
  }

  async getUsersByCompany(companyId) {
    const company = await Company.findByPk(companyId, { include: User });
    if (!company) return { success: false, message: "Company not found" };
    return { success: true, data: company.Users };
  }

  async removeUserFromCompany(userId, companyId) {
    const relation = await UserCompany.findOne({ where: { user_id: userId, company_id: companyId } });
    if (!relation) return { success: false, message: "Relation not found" };

    await relation.destroy();
    return { success: true, message: "User removed from company" };
  }
}

module.exports = new UserCompanyService();
