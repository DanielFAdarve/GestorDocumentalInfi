const { z } = require('zod');

const dependencyEnum = ['TIC', 'Corporativos', 'Proyectos', 'Bienes', 'Planeación', 'Otra'];
const statusEnum = ['Activo', 'Finalizado_Completo', 'Finalizado_Previo'];

const createContractSchema = z.object({
  companyId: z.number({ required_error: 'La empresa es obligatoria' }),
  contract_number: z.string().nonempty('El número de contrato es obligatorio'),
  contract_type: z.string().nonempty('El tipo de contrato es obligatorio'),
  contract_object: z.string().nonempty('El objeto del contrato es obligatorio'),
  userId: z.number({ required_error: 'El usuario contratista es obligatorio' }),
  dependency: z.enum(dependencyEnum),
  estimated_value: z.number().positive('El valor estimado debe ser mayor a 0'),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  sign_date: z.coerce.date().optional(),
  status: z.enum(statusEnum).default('Activo'),
  comment: z.string().optional(),
  resolutionId: z.number().optional(),
  responsibilities: z.string().optional(),
});

const updateContractSchema = createContractSchema.partial();

module.exports = {
  createContractSchema,
  updateContractSchema,
};
