const express = require('express');
const router = express.Router();


const { User } = require('../database'); // o donde definas el modelo
const UserRepository = require('../modules/user/user.repository');
const UserService = require('../modules/user/user.service');
const JwtHelper = require('../utils/jwt');


// Importar rutas por módulo
const userRoutes = require('../modules/user/user.routes');
// const companyRoutes = require('../modules/company/company.routes');
// const contractRoutes = require('../modules/contract/contract.routes');


// Inicializar dependencias (inyección manual)
const userRepository = new UserRepository(User);
const userService = new UserService(userRepository);


// Registrar rutas base
router.use('/users', userRoutes(userService, JwtHelper));
// router.use('/companies', companyRoutes);
// router.use('/contracts', contractRoutes);

module.exports = router;
