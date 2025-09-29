const express = require("express");
const router = express.Router();
const UserContractRoleController = require("../controllers/userContractRole.controller");

router.post("/", UserContractRoleController.assign);
router.get("/user/:userId", UserContractRoleController.getRoles);
router.get("/contract/:contractId", UserContractRoleController.getUsers);
router.put("/:userId/:contractId", UserContractRoleController.update);
router.delete("/:userId/:contractId", UserContractRoleController.remove);

module.exports = router;
