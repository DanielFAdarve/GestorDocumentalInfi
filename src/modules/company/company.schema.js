const { z } = require('zod');

const createCompanySchema = z.object({
  name: z.string().trim().nonempty('El nombre es obligatorio'),
  tax_id: z.string().trim().optional(),
  address: z.string().trim().optional(),
  active: z.boolean().optional(),
});

const updateCompanySchema = createCompanySchema.partial();

module.exports = {
  createCompanySchema,
  updateCompanySchema,
};
