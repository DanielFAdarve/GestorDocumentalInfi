const { z } = require('zod');

const uploadEvidenceSchema = z.object({
  uploaderUserContractRoleId: z.number(),
  fileBase64: z.string().nonempty(),
  fileName: z.string().nonempty(),
  mimeType: z.string().optional(),
  comment: z.string().optional(),
  creatorUserId: z.number().optional()
});

module.exports = { uploadEvidenceSchema };
