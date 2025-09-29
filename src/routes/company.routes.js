const express = require("express");
const router = express.Router();
const CompanyController = require("../controllers/company.controller");

router.post("/", CompanyController.create);
router.get("/", CompanyController.getAll);
router.get("/:id", CompanyController.getById);
router.put("/:id", CompanyController.update);
router.delete("/:id", CompanyController.delete);

module.exports = router;
