const express = require("express");
const router = express.Router();
const ResolutionController = require("../controllers/resolution.controller");

router.post("/", ResolutionController.create);
router.get("/", ResolutionController.getAll);
router.get("/:id", ResolutionController.getById);
router.put("/:id", ResolutionController.update);
router.delete("/:id", ResolutionController.delete);

module.exports = router;
