// src/modules/reports/report.routes.js
const express = require('express');
const ReportController = require('./report.controller');

module.exports = (reportService) => {
    const router = express.Router();
    const controller = new ReportController(reportService);

    router.get('/contracts-compliance', controller.getContractsCompliance);
    router.get(
        '/contracts-supports-compliance',
        controller.getContractsSupportsCompliance
    );
    return router;
};
