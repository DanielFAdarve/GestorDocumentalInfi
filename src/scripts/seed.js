const sequelize = require("../config/database");

// Import models
const User = require("../models/user.model");
const Company = require("../models/company.model");
const UserCompany = require("../models/userCompany.model");
const Resolution = require("../models/resolution.model");
const Support = require("../models/support.model");
const Contract = require("../models/contract.model");
const UserContract = require("../models/userContract.model");
const Role = require("../models/role.model");
const Permission = require("../models/permission.model");
const RolePermission = require("../models/rolePermission.model");
const ContractPermission = require("../models/contractPermission.model");

// Associations (same as in index.js)
require("../models/index"); // to load associations

async function seed() {
  try {
    await sequelize.sync({ force: true });
    console.log("🗑️ Database dropped & recreated");

    // ===================
    // USERS
    // ===================
    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "hashed_admin_pass",
      user_type: "admin"
    });

    const normalUser = await User.create({
      name: "John Doe",
      email: "john@example.com",
      password: "hashed_pass",
      user_type: "normal"
    });

    // ===================
    // COMPANIES
    // ===================
    const companyA = await Company.create({ name: "Tech Corp", tax_id: 123456789 });
    const companyB = await Company.create({ name: "Biz Solutions", tax_id: 987654321 });

    // Link users to companies
    await UserCompany.create({ userId: admin.id, companyId: companyA.id });
    await UserCompany.create({ userId: normalUser.id, companyId: companyA.id });
    await UserCompany.create({ userId: normalUser.id, companyId: companyB.id });

    // ===================
    // RESOLUTIONS
    // ===================
    const resolution1 = await Resolution.create({ resolution_name: "Resolution A" });
    const resolution2 = await Resolution.create({ resolution_name: "Resolution B" });

    // SUPPORTS
    await Support.create({ resolutionId: resolution1.id, support_name: "Financial Report", description: "Quarterly balance", delivery_term: 30 });
    await Support.create({ resolutionId: resolution1.id, support_name: "Compliance Certificate", description: "Legal compliance", delivery_term: 60 });
    await Support.create({ resolutionId: resolution2.id, support_name: "Technical Report", description: "Infra analysis", delivery_term: 45 });

    // ===================
    // ROLES
    // ===================
    const supervisorRole = await Role.create({ name: "Supervisor", description: "Supervises contract execution" });
    const operatorRole = await Role.create({ name: "Operator", description: "Executes tasks" });

    // PERMISSIONS
    const createPerm = await Permission.create({ permission_name: "create_support" });
    const uploadPerm = await Permission.create({ permission_name: "upload_file" });
    const approvePerm = await Permission.create({ permission_name: "approve_contract" });

    // ROLES ↔ PERMISSIONS
    await RolePermission.create({ roleId: supervisorRole.id, permissionId: approvePerm.id });
    await RolePermission.create({ roleId: supervisorRole.id, permissionId: uploadPerm.id });
    await RolePermission.create({ roleId: operatorRole.id, permissionId: uploadPerm.id });
    await RolePermission.create({ roleId: operatorRole.id, permissionId: createPerm.id });

    // ===================
    // CONTRACTS
    // ===================
    const contract1 = await Contract.create({
      contract_number: "CON-001",
      start_date: new Date(),
      companyId: companyA.id,
      resolutionId: resolution1.id
    });

    const contract2 = await Contract.create({
      contract_number: "CON-002",
      start_date: new Date(),
      companyId: companyB.id,
      resolutionId: resolution2.id
    });

    // USER ↔ CONTRACT (with ROLE)
    await UserContract.create({ userId: admin.id, contractId: contract1.id, roleId: supervisorRole.id });
    await UserContract.create({ userId: normalUser.id, contractId: contract1.id, roleId: operatorRole.id });
    await UserContract.create({ userId: normalUser.id, contractId: contract2.id, roleId: operatorRole.id });

    // ===================
    // CONTRACT PERMISSIONS (EXCEPTIONS)
    // ===================
    await ContractPermission.create({ userId: normalUser.id, contractId: contract1.id, permissionId: approvePerm.id });

    console.log("✅ Seeding completed successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  }
}

seed();
