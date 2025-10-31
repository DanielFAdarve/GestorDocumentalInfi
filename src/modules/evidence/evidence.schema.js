const { z } = require('zod');

const contractIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'El ID del contrato debe ser numérico'),
});

module.exports = {
  contractIdSchema,
};
