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

const EvidenceRepository = require('../modules/evidence/evidence.repository');
const EvidenceService = require('../modules/evidence/evidence.service');

const SupportRepository = require('../modules/support/support.repository');
const SupportService = require('../modules/support/support.service');

const SupportValidationRepository = require('../modules/supportValidation/supportValidation.repository');
const SupportValidationService = require('../modules/supportValidation/supportValidation.service');


// Importar rutas por módulo
const userRoutes = require('../modules/user/user.routes');
const companyRoutes = require('../modules/company/company.routes');
const contractRoutes = require('../modules/contract/contract.routes');
const userContractRoutes = require('../modules/userContract/userContract.routes');
const EvidenceRoutes = require('../modules/evidence/evidence.routes');
const SupportRoutes = require('../modules/support/support.routes');
const SupportValidationRoutes = require('../modules/supportValidation/supportValidation.routes');
const auditRoutes = require('../modules/audit/audit.routes');


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

//Evidences 
const evidenceRepository = new EvidenceRepository({
  SupportUpload: models.SupportUpload,
  ContractSupport: models.ContractSupport,
  Support: models.Support,
  User: models.User,

});

const evidenceService = new EvidenceService(evidenceRepository);

// Supports
const supportRepository = new SupportRepository({
  ContractSupport: models.ContractSupport,
  Support: models.Support,
  SupportUpload: models.SupportUpload,
  SupportHistory: models.SupportHistory,
  UserContractRole: models.UserContractRole,
  User: models.User,
});
const supportService = new SupportService(supportRepository);

//support validation
const supportValidationRepository = new SupportValidationRepository({
  Contract: models.Contract,
  Resolution: models.Resolution,
  ResolutionSupport: models.ResolutionSupport,
  Support: models.Support,
  ContractSupport: models.ContractSupport,
});
const supportValidationService = new SupportValidationService(supportValidationRepository);



// Registrar rutas base
router.use('/users', userRoutes(userService, JwtHelper));
router.use('/companies', companyRoutes(companyService));
router.use('/contracts', contractRoutes(contractService));
router.use('/user-contract-roles', userContractRoutes(userContractService));
router.use('/evidence', EvidenceRoutes(evidenceService));
router.use('/supports', SupportRoutes(supportService));
router.use('/support-validation', SupportValidationRoutes(supportValidationService));
router.use('/audit', auditRoutes);

module.exports = router;
