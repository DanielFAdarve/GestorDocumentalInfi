const { z } = require('zod');

const areaEnum = ['administrativa', 'técnica', 'financiera', 'contable', 'legal', 'otra'];

const createUserSchema = z.object({
  name: z.string().trim().nonempty('El nombre es obligatorio'),
  email: z.string().trim().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener mínimo 6 caracteres'),
  user_type: z.string().optional().default('Usuario'),
  area: z.enum(areaEnum, {
    required_error: 'El área es obligatoria',
    invalid_type_error: 'Área inválida',
  }),
  active: z.boolean().optional(),
});

const updateUserSchema = createUserSchema.partial();

module.exports = {
  createUserSchema,
  updateUserSchema,
};