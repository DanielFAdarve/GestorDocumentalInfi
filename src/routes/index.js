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

// const ContractRepository = require('../modules/contract/contract.repository');
// const ObligationRepository = require('../modules/contract/contractObligation.repository');
// const FileRepository = require('../modules/contract/contractFile.repository');
// const ContractService = require('../modules/contract/contract.service');


const UserContractRepository = require('../modules/userContract/userContract.repository');
const UserContractService = require('../modules/userContract/userContract.service');

const EvidenceRepository = require('../modules/evidence/evidence.repository');
const EvidenceService = require('../modules/evidence/evidence.service');

const SupportRepository = require('../modules/support/support.repository');
const SupportService = require('../modules/support/support.service');

const SupportValidationRepository = require('../modules/supportValidation/supportValidation.repository');
const SupportValidationService = require('../modules/supportValidation/supportValidation.service');

const SupportManagerRepository = require('../modules/support_manager/supportManager.repository');
const SupportManagerService = require('../modules/support_manager/supportManager.service');

// Importar rutas por módulo
const userRoutes = require('../modules/user/user.routes');
const companyRoutes = require('../modules/company/company.routes');
const contractRoutes = require('../modules/contract/contract.routes');
const userContractRoutes = require('../modules/userContract/userContract.routes');
const EvidenceRoutes = require('../modules/evidence/evidence.routes');
const SupportRoutes = require('../modules/support/support.routes');
const SupportValidationRoutes = require('../modules/supportValidation/supportValidation.routes');
const auditRoutes = require('../modules/audit/audit.routes');
const supportManagerRoutesFactory = require('../modules/support_manager/supportManager.routes');

// Instancias e inyección de dependencias
// User
const userRepository = new UserRepository(models.User);
const userService = new UserService(userRepository);

// Company
const companyRepository = new CompanyRepository(models.Company);
const companyService = new CompanyService(companyRepository);

// // Contract
// const contractRepository = new ContractRepository(models.Contract, models.UserContractRole);
// const obligationRepository = new ObligationRepository(models.Obligation);
// const fileRepository = new FileRepository(models.ContractFile);

// const contractService = new ContractService(contractRepository, models.sequelize);
// const contractService = new ContractService(
//   contractRepository,
//   obligationRepository,
//   fileRepository,
//   models.sequelize
// );

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


// instancias (usa tus modelos existentes)
const supportManagerRepository = new SupportManagerRepository(models);
    

const supportManagerService = new SupportManagerService( supportManagerRepository,models, models.sequelize);


const NotificationService = require("../modules/notification/notification.service");
const NotificationController = require("../modules/notification/notification.controller");
const notificationRoutes = require("../modules/notification/notification.routes");

const notificationService = new NotificationService(models);
const notificationController = new NotificationController(notificationService);


const ContractManagerRepository = require('../modules/contract_manager/contract.repository');
const ObligationRepository = require('../modules/contract_manager/obligation.repository');
const FileRepository = require('../modules/contract_manager/file.repository');
const ContractManagerService = require('../modules/contract_manager/contract.service');
const contractManagerRoutesFactory = require('../modules/contract_manager/contract.routes');

// Instanciación
const contractManagerRepository = new ContractManagerRepository(models.Contract, models.UserContractRole);
const ObligationManagerRepository = new ObligationRepository(models);
const FileManagerRepository = new FileRepository(models);
const contractManagerService = new ContractManagerService(
  contractManagerRepository,
  ObligationManagerRepository,
  FileManagerRepository,
  models.sequelize
);

const ReportService = require('../modules/report/report.service');
const reportRoutes = require('../modules/report/report.routes');
const reportService = new ReportService(models);


// Registrar rutas base
router.use('/users', userRoutes(userService, JwtHelper));
router.use('/companies', companyRoutes(companyService));
// router.use('/contracts', contractRoutes(contractService));
router.use('/contracts', contractManagerRoutesFactory(contractManagerService));
router.use('/user-contract-roles', userContractRoutes(userContractService));
router.use('/evidence', EvidenceRoutes(evidenceService));
router.use('/supports', SupportRoutes(supportService));
router.use('/support-validation', SupportValidationRoutes(supportValidationService));
router.use('/audit', auditRoutes);
router.use('/supports-manager', supportManagerRoutesFactory(supportManagerService));
router.use("/notifications", notificationRoutes(notificationController));
router.use('/reports', reportRoutes(reportService));

module.exports = router;
