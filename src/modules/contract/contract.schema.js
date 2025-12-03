// const { z } = require('zod');

// const dependencyEnum = ['TIC', 'Corporativos', 'Proyectos', 'Bienes', 'Planeación', 'Otra'];
// const statusEnum = ['Activo', 'Finalizado_Completo', 'Finalizado_Previo'];

// const createContractSchema = z.object({
//   companyId: z.number({ required_error: 'La empresa es obligatoria' }),
//   contract_number: z.string().nonempty('El número de contrato es obligatorio'),
//   contract_type: z.string().nonempty('El tipo de contrato es obligatorio'),
//   contract_object: z.string().nonempty('El objeto del contrato es obligatorio'),
//   userId: z.number({ required_error: 'El usuario contratista es obligatorio' }),
//   dependency: z.enum(dependencyEnum),
//   estimated_value: z.number().positive('El valor estimado debe ser mayor a 0'),
//   start_date: z.coerce.date(),
//   end_date: z.coerce.date(),
//   sign_date: z.coerce.date().optional(),
//   status: z.enum(statusEnum).default('Activo'),
//   comment: z.string().optional(),
//   resolutionId: z.number().optional(),
//   responsibilities: z.string().optional(),
//   future_validity: z.boolean().optional().default(false),
//   liquidation: z.boolean().optional().default(false),
//   enviromental_obligations: z.boolean().optional().default(false),
//   consumption_obligations: z.boolean().optional().default(false),
//   reservation: z.boolean().optional().default(false),
//   secop_contract: z.string().optional(),
//   status_secop: z.string().optional().default('Pendiente_Creacion'),
// });

// const updateContractSchema = createContractSchema.partial();

// module.exports = {
//   createContractSchema,
//   updateContractSchema,
// };

const { z } = require('zod');

const dependencyEnum = ['TIC', 'Corporativos', 'Proyectos', 'Bienes', 'Planeación', 'Otra'];
const statusEnum = ['Activo', 'Finalizado_Completo', 'Finalizado_Previo'];

const obligationSchema = z.object({
  description: z.string().nonempty(),
  type: z.enum(['Ambiental', 'Consumo', 'General']),
  periodicity: z.string().optional(),
  due_date: z.coerce.date(),
});

const fileSchema = z.object({
  file_name: z.string(),
  file_path: z.string(),
  file_type: z.string(),
});

const createContractSchema = z.object({
  companyId: z.number(),
  contract_number: z.string().nonempty(),
  contract_type: z.string().nonempty(),
  contract_object: z.string().nonempty(),
  userId: z.number(),
  dependency: z.enum(dependencyEnum),
  estimated_value: z.number().positive(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  sign_date: z.coerce.date().optional(),
  status: z.enum(statusEnum).default('Activo'),
  comment: z.string().optional(),
  resolutionId: z.number().optional(),

  // NUEVOS CAMPOS
  future_validity: z.boolean().default(false),
  liquidation: z.boolean().default(false),
  enviromental_obligations: z.boolean().default(false),
  consumption_obligations: z.boolean().default(false),
  reservation: z.boolean().default(false),

  // SECOP
  secop_contract: z.string().optional(),
  status_secop: z.string().default('Pendiente_Creacion'),

  // COMPLEMENTOS
  obligations: z.array(obligationSchema).optional(),
  files: z.array(fileSchema).optional(),
});

const updateContractSchema = createContractSchema.partial();

module.exports = {
  createContractSchema,
  updateContractSchema,
};
