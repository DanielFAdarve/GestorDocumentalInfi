// src/routes/userCompany.routes.js
const express = require('express');
const router = express.Router();

const userCompanyController = require('../controllers/userCompany.controller');

router.post('/', userCompanyController.add);             
router.get('/user/:userId', userCompanyController.getCompanies);
router.get('/company/:companyId', userCompanyController.getUsers);
router.delete('/:userId/:companyId', userCompanyController.remove);

module.exports = router;