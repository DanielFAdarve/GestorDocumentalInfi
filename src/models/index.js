const sequelize = require("../config/database");

// models
const User = require("./user.model");
const Company = require("./company.model");
const UserCompany = require("./userCompany.model");
const Resolution = require("./resolution.model");
const Support = require("./support.model");
const Contract = require("./contract.model");
const UserContract = require("./userContract.model");
const Role = require("./role.model");
const Permission = require("./permission.model");
const RolePermission = require("./rolePermission.model");
const ContractPermission = require("./contractPermission.model");
const ContractSupport = require("./contractSupport.model");
const SupportHistory = require("./supportHistory.model");

// Relaciones de las tablas
User.belongsToMany(Company, { through: UserCompany, foreignKey: "userId" });
Company.belongsToMany(User, { through: UserCompany, foreignKey: "companyId" });

// 2. Company ↔ Contract (One-to-Many)
Company.hasMany(Contract, { foreignKey: "companyId" });
Contract.belongsTo(Company, { foreignKey: "companyId" });

// 3. Resolution ↔ Contract (One-to-Many)
Resolution.hasMany(Contract, { foreignKey: "resolutionId" });
Contract.belongsTo(Resolution, { foreignKey: "resolutionId" });

// 4. Resolution ↔ Support (One-to-Many)
Resolution.hasMany(Support, { foreignKey: "resolutionId" });
Support.belongsTo(Resolution, { foreignKey: "resolutionId" });

// 5. User ↔ Contract (Many-to-Many with Role through UserContract)
User.belongsToMany(Contract, { through: UserContract, foreignKey: "userId" });
Contract.belongsToMany(User, { through: UserContract, foreignKey: "contractId" });

// Add Role relation to UserContract
Role.hasMany(UserContract, { foreignKey: "roleId" });
UserContract.belongsTo(Role, { foreignKey: "roleId" });

// 6. Role ↔ Permission (Many-to-Many)
Role.belongsToMany(Permission, { through: RolePermission, foreignKey: "roleId" });
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: "permissionId" });

// 7. User ↔ Contract ↔ Permission (ContractPermission)
User.belongsToMany(Permission, { through: ContractPermission, foreignKey: "userId" });
Permission.belongsToMany(User, { through: ContractPermission, foreignKey: "permissionId" });

Contract.hasMany(ContractPermission, { foreignKey: "contractId" });
ContractPermission.belongsTo(Contract, { foreignKey: "contractId" });

// 🔹 Asociaciones directas necesarias para los include en UserContract
UserContract.belongsTo(User, { foreignKey: "userId" });
UserContract.belongsTo(Contract, { foreignKey: "contractId" });
UserContract.belongsTo(Role, { foreignKey: "roleId" });

// (opcional pero recomendado para navegación inversa)
User.hasMany(UserContract, { foreignKey: "userId" });
Contract.hasMany(UserContract, { foreignKey: "contractId" });
Role.hasMany(UserContract, { foreignKey: "roleId" });

// Contrato tiene varios soportes asociados (con responsable)
Contract.hasMany(ContractSupport, { foreignKey: "contractId" });
ContractSupport.belongsTo(Contract, { foreignKey: "contractId" });

// Un soporte base puede tener varios soportes por contrato
Support.hasMany(ContractSupport, { foreignKey: "supportId" });
ContractSupport.belongsTo(Support, { foreignKey: "supportId" });

// Un usuario puede ser responsable de varios soportes
User.hasMany(ContractSupport, { foreignKey: "userId" });
ContractSupport.belongsTo(User, { foreignKey: "userId" });

// Histórico de versiones/cargas
ContractSupport.hasMany(SupportHistory, { foreignKey: "contractSupportId" });
SupportHistory.belongsTo(ContractSupport, { foreignKey: "contractSupportId" });

// Un usuario puede generar varios registros históricos
User.hasMany(SupportHistory, { foreignKey: "userId" });
SupportHistory.belongsTo(User, { foreignKey: "userId" });
// (async () => {
//   try {
//     await sequelize.sync({ force: true });
//     console.log("✅ Database synced successfully");
//   } catch (error) {
//     console.error("❌ Error syncing database:", error);
//   }
// })();


module.exports = {
  sequelize,
  User,
  Company,
  UserCompany,
  Resolution,
  Support,
  Contract,
  UserContract,
  Role,
  Permission,
  RolePermission,
  ContractPermission,
  ContractSupport,
  SupportHistory,
};