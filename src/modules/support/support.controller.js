const { uploadSupportSchema, updateStatusSchema } = require('./support.schema');

class SupportController {
    constructor(supportService) {
        this.supportService = supportService;
    }

    listSupports = async (req, res, next) => {
        try {
            const { contractId } = req.params;
            const result = await this.supportService.listSupports(contractId);
            res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    };

    uploadSupport = async (req, res, next) => {
        try {
            const validated = uploadSupportSchema.parse(req.body);
            const createdBy = req.user?.id || 1; // si tienes auth middleware
            const result = await this.supportService.uploadSupport({ ...validated, createdBy });
            res.status(201).json(result);
        } catch (err) {
            next(err);
        }
    };

    updateStatus = async (req, res, next) => {
        try {
            const { uploadId } = req.params;
            const validated = updateStatusSchema.parse(req.body);
            const result = await this.supportService.updateStatus(uploadId, validated.status, validated.comment, validated.usersContractId);
            res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    };

    getHistory = async (req, res, next) => {
        try {
            // const { contractId } = req.params;
            const  contractSupportId  = req.params; // opcional en la URL
            const result = await this.supportService.getHistory(contractId, contractSupportId);
            res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    };
}

module.exports = SupportController;
