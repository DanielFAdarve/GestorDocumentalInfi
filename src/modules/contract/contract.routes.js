const express = require("express");
const router = express.Router();
const ContractController = require("./contract.controller");

router.post("/", ContractController.create);
router.get("/", ContractController.getAll);
router.get("/:id", ContractController.getById);
router.put("/:id", ContractController.update);
router.delete("/:id", ContractController.delete);

module.exports = router;
