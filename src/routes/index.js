// src/routes/index.js
const express = require('express');
const router = express.Router();

const JwtHelper = require('../utils/jwt');
const models = require('../database');

// Importar repositorios y servicios
const UserRepository = require('../modules/user/user.repository');
const UserService = require('../modules/user/user.service');

const CompanyRepository = require('../modules/company/company.repository');
const CompanyService = require('../modules/company/company.service');

const ContractRepository = require('../modules/contract/contract.repository');
const ContractService = require('../modules/contract/contract.service');

const UserContractRepository = require('../modules/userContract/userContract.repository');
const UserContractService = require('../modules/userContract/userContract.service');

// Importar rutas por módulo
const userRoutes = require('../modules/user/user.routes');
const companyRoutes = require('../modules/company/company.routes');
const contractRoutes = require('../modules/contract/contract.routes');
const userContractRoutes = require('../modules/userContract/userContract.routes');

// Instancias e inyección de dependencias
// User
const userRepository = new UserRepository(models.User);
const userService = new UserService(userRepository);

// Company
const companyRepository = new CompanyRepository(models.Company);
const companyService = new CompanyService(companyRepository);

// Contract
const contractRepository = new ContractRepository(models.Contract, models.UserContractRole);
const contractService = new ContractService(contractRepository, models.sequelize);

// UserContract
const userContractRepository = new UserContractRepository(models);
const userContractService = new UserContractService(userContractRepository);

// Registrar rutas base
router.use('/users', userRoutes(userService, JwtHelper));
router.use('/companies', companyRoutes(companyService));
router.use('/contracts', contractRoutes(contractService));
router.use('/user-contract-roles', userContractRoutes(userContractService));

module.exports = router;
