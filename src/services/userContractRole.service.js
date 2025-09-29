const UserContractRole = require("../models/userContractRole.model");
const User = require("../models/user.model");
const Contract = require("../models/contract.model");
const Company = require("../models/company.model");
const UserCompany = require("../models/userCompany.model");

class UserContractRoleService {
  async assignRoleToUser(data) {
    try {
      const { user_id, contract_id, role } = data;

      if (!user_id || !contract_id || !role)
        return { success: false, message: "user_id, contract_id and role are required" };

      // Validar usuario
      const user = await User.findByPk(user_id);
      if (!user) return { success: false, message: "User not found" };

      // Validar contrato
      const contract = await Contract.findByPk(contract_id);
      if (!contract) return { success: false, message: "Contract not found" };

      // Validar rol permitido
      const validRoles = ["viewer", "editor", "manager", "admin"];
      if (!validRoles.includes(role))
        return { success: false, message: `Invalid role. Must be one of: ${validRoles.join(", ")}` };

      // Validar que usuario pertenezca a la empresa dueña del contrato
      const belongs = await UserCompany.findOne({
        where: { user_id, company_id: contract.company_id },
      });
      if (!belongs)
        return { success: false, message: "User must belong to the contract's company" };

      // Evitar duplicados
      const exists = await UserContractRole.findOne({ where: { user_id, contract_id } });
      if (exists) return { success: false, message: "User already has a role in this contract" };

      const relation = await UserContractRole.create(data);
      return { success: true, data: relation };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  async getRolesByUser(userId) {
    const roles = await UserContractRole.findAll({
      where: { user_id: userId },
      include: Contract,
    });
    if (!roles.length) return { success: false, message: "No roles found for this user" };
    return { success: true, data: roles };
  }

  async getUsersByContract(contractId) {
    const roles = await UserContractRole.findAll({
      where: { contract_id: contractId },
      include: User,
    });
    if (!roles.length) return { success: false, message: "No users found for this contract" };
    return { success: true, data: roles };
  }

  async updateUserRole(userId, contractId, newRole) {
    const relation = await UserContractRole.findOne({ where: { user_id: userId, contract_id: contractId } });
    if (!relation) return { success: false, message: "Relation not found" };

    const validRoles = ["viewer", "editor", "manager", "admin"];
    if (!validRoles.includes(newRole))
      return { success: false, message: `Invalid role. Must be one of: ${validRoles.join(", ")}` };

    relation.role = newRole;
    await relation.save();
    return { success: true, message: "Role updated", data: relation };
  }

  async removeUserRole(userId, contractId) {
    const relation = await UserContractRole.findOne({ where: { user_id: userId, contract_id: contractId } });
    if (!relation) return { success: false, message: "Relation not found" };

    await relation.destroy();
    return { success: true, message: "User role removed from contract" };
  }
}

module.exports = new UserContractRoleService();
