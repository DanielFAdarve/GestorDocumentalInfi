const express = require("express");
const router = express.Router();
const RoleController = require("../controllers/role.controller");

router.post("/", RoleController.create);
router.get("/", RoleController.getAll);
router.get("/:id", RoleController.getById);
router.put("/:id", RoleController.update);
router.delete("/:id", RoleController.delete);

module.exports = router;
