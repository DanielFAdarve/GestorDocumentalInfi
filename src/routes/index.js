// src/routes/index.js
const express = require('express');
const router = express.Router();

const JwtHelper = require('../utils/jwt');
const models = require('../database'); // ✅ Instancia principal de Sequelize

// ========================================================
// 📦 IMPORTAR REPOSITORIOS, SERVICIOS Y RUTAS
// ========================================================

// Users
const UserRepository = require('../modules/user/user.repository');
const UserService = require('../modules/user/user.service');
const userRoutes = require('../modules/user/user.routes');

// Companies
const CompanyRepository = require('../modules/company/company.repository');
const CompanyService = require('../modules/company/company.service');
const companyRoutes = require('../modules/company/company.routes');

// Contracts
const ContractRepository = require('../modules/contract/contract.repository');
const ContractService = require('../modules/contract/contract.service');
const contractRoutes = require('../modules/contract/contract.routes');

// User-Contract Roles
const UserContractRepository = require('../modules/userContract/userContract.repository');
const UserContractService = require('../modules/userContract/userContract.service');
const userContractRoutes = require('../modules/userContract/userContract.routes');

// Reports (nuevo módulo)
const ReportsRepository = require('../modules/reports/reports.repository');
const ReportsService = require('../modules/reports/reports.service');
const reportsRoutes = require('../modules/reports/reports.routes');

// ========================================================
// ⚙️ INYECCIÓN DE DEPENDENCIAS
// ========================================================

// Users
const userRepository = new UserRepository(models.User);
const userService = new UserService(userRepository);

// Companies
const companyRepository = new CompanyRepository(models.Company);
const companyService = new CompanyService(companyRepository);

// Contracts
const contractRepository = new ContractRepository(models.Contract, models.UserContractRole);
const contractService = new ContractService(contractRepository, models.sequelize);

// User-Contract Roles
const userContractRepository = new UserContractRepository(models);
const userContractService = new UserContractService(userContractRepository);

const reportsRepository = new ReportsRepository(models, models.sequelize);
const reportsService = new ReportsService(reportsRepository);


// ========================================================
// 🚏 REGISTRO DE RUTAS
// ========================================================

router.use('/users', userRoutes(userService, JwtHelper));
router.use('/companies', companyRoutes(companyService));
router.use('/contracts', contractRoutes(contractService));
router.use('/user-contract-roles', userContractRoutes(userContractService));

// ✅ Endpoint nuevo: /api/contracts/{contractId}/obligations
router.use('/', reportsRoutes(reportsService));

// ========================================================
// 📤 EXPORTAR ROUTER
// ========================================================
module.exports = router;
