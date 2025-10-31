const { z } = require('zod');

const uploadSupportSchema = z.object({
    contractSupportId: z.number().int().positive('El ID del soporte contractual es obligatorio'),
    contractId: z.number().int().optional(), 
    supportId: z.number().int().optional(),  
    base64File: z.string().nonempty('El archivo en base64 es obligatorio'),
    fileName: z.string().trim().nonempty('El nombre del archivo es obligatorio'),
    usersContractId: z.number().int().optional(),
});

const updateStatusSchema = z.object({
    status: z.enum(['pending', 'approved', 'rejected'], {
        required_error: 'El estado es obligatorio',
    }),
    comment: z.string().optional(),
    usersContractId: z.number().int().optional(),
});

module.exports = {
    uploadSupportSchema,
    updateStatusSchema,
};
