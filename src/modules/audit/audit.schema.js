const { z } = require('zod');

const AuditLogSchema = z.object({
  userId: z.number().nullable(),
  userName: z.string().nullable(),
  entity: z.string(),
  action: z.string(),
  method: z.string().nullable(),
  endpoint: z.string().nullable(),
  oldValue: z.string().nullable(),
  newValue: z.string().nullable(),
  ipAddress: z.string().nullable(),
  timestamp: z.string().optional(),
});

module.exports = { AuditLogSchema };
