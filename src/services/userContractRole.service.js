const UserContract = require("../models/userContract.model");
const User = require("../models/user.model");
const Contract = require("../models/contract.model");
const Company = require("../models/company.model");
const UserCompany = require("../models/userCompany.model");
const Role = require("../models/role.model");

class UserContractRoleService {
  async assignRoleToUser(data) {
    try {
      const { userId, contractId, roleId } = data;

      if (!userId || !contractId || !roleId)
        return { success: false, message: "userId, contractId y roleId son requeridos" };

      // Validar usuario
      const user = await User.findByPk(userId);
      if (!user) return { success: false, message: "Usuario no encontrado" };

      // Validar contrato
      const contract = await Contract.findByPk(contractId);
      if (!contract) return { success: false, message: "Contrato no encontrado" };

      // Validar rol
      const role = await Role.findByPk(roleId);
      if (!role) return { success: false, message: "Rol no válido" };

      // Validar que usuario pertenezca a la empresa del contrato
      const belongs = await UserCompany.findOne({
        where: { userId, companyId: contract.companyId },
      });
      if (!belongs)
        return { success: false, message: "El usuario no pertenece a la empresa dueña del contrato" };

      // Evitar duplicados
      const exists = await UserContract.findOne({ where: { userId, contractId } });
      if (exists) return { success: false, message: "El usuario ya tiene un rol en este contrato" };

      // Crear la relación
      const relation = await UserContract.create({ userId, contractId, roleId });
      return { success: true, data: relation };
    } catch (err) {
      console.error(err);
      return { success: false, message: err.message };
    }
  }

  async getRolesByUser(userId) {
    const roles = await UserContract.findAll({
      where: { userId },
      include: [
        { model: Contract },
        { model: Role },
      ],
    });
    if (!roles.length) return { success: false, message: "No se encontraron roles para este usuario" };
    return { success: true, data: roles };
  }

  async getUsersByContract(contractId) {
    const roles = await UserContract.findAll({
      where: { contractId },
      include: [
        { model: User },
        { model: Role },
      ],
    });
    if (!roles.length) return { success: false, message: "No se encontraron usuarios para este contrato" };
    return { success: true, data: roles };
  }

  async updateUserRole(userId, contractId, newRoleId) {
    const relation = await UserContract.findOne({ where: { userId, contractId } });
    if (!relation) return { success: false, message: "Relación no encontrada" };

    const role = await Role.findByPk(newRoleId);
    if (!role) return { success: false, message: "Rol no válido" };

    relation.roleId = newRoleId;
    await relation.save();
    return { success: true, message: "Rol actualizado", data: relation };
  }

  async removeUserRole(userId, contractId) {
    const relation = await UserContract.findOne({ where: { userId, contractId } });
    if (!relation) return { success: false, message: "Relación no encontrada" };

    await relation.destroy();
    return { success: true, message: "Rol de usuario eliminado del contrato" };
  }
}

module.exports = new UserContractRoleService();
