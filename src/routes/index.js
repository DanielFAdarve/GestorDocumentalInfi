const express = require('express');
const router = express.Router();

const JwtHelper = require('../utils/jwt');

const { User,Company } = require('../database'); 

// Importar repositorios y servicios
const UserRepository = require('../modules/user/user.repository');
const UserService = require('../modules/user/user.service');

const CompanyRepository = require('../modules/company/company.repository');
const CompanyService = require('../modules/company/company.service');


// Importar rutas por módulo
const userRoutes = require('../modules/user/user.routes');
const companyRoutes = require('../modules/company/company.routes');
// const contractRoutes = require('../modules/contract/contract.routes');



// Instancias e inyección de dependencias
//User
const userRepository = new UserRepository(User);
const userService = new UserService(userRepository);

//Company
const companyRepository = new CompanyRepository(Company);
const companyService = new CompanyService(companyRepository);


// Registrar rutas base
router.use('/users', userRoutes(userService, JwtHelper));
router.use('/companies', companyRoutes(companyService));
// router.use('/contracts', contractRoutes);

module.exports = router;
