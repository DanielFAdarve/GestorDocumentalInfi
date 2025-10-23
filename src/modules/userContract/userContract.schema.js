const { z } = require('zod');

const createUserContractRoleSchema = z.object({
  userId: z.number({
    required_error: 'El ID de usuario es obligatorio',
  }),
  contractId: z.number({
    required_error: 'El ID de contrato es obligatorio',
  }),
  roleId: z.number().optional(), // por defecto puede ser 2 en el servicio si no se envía
});

const updateUserContractRoleSchema = createUserContractRoleSchema.partial();

module.exports = {
  createUserContractRoleSchema,
  updateUserContractRoleSchema,
};