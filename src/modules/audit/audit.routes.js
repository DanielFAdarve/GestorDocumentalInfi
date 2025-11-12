const express = require('express');
const router = express.Router();
const controller = require('./audit.controller');
const { validateSchema } = require('../../middlewares/validate.middleware');
const { AuditLogSchema } = require('./audit.schema');

// Obtener todos los registros
router.get('/', controller.getAll);

// Obtener un registro por ID
router.get('/:id', controller.getById);

// Crear manualmente (opcional)
router.post('/', validateSchema(AuditLogSchema), controller.create);

// Eliminar un registro
router.delete('/:id', controller.delete);

module.exports = router;
