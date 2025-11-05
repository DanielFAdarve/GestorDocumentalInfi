class SupportRepository {
    constructor({ ContractSupport, Support, SupportUpload, SupportHistory, UserContractRole, User }) {
        this.ContractSupport = ContractSupport;
        this.Support = Support;
        this.SupportUpload = SupportUpload;
        this.SupportHistory = SupportHistory;
        this.UserContractRole = UserContractRole
        this.User = User;
    }

    async findSupportsByContract(contractId) {
        return this.ContractSupport.findAll({
            where: { contractId },
            include: [
                {
                    model: this.Support,
                    as: 'support',
                    attributes: ['id', 'support_name', 'description', 'delivery_term'],
                },
                {
                    model: this.SupportUpload,
                    as: 'upload',
                    include: [{ model: this.User, as: 'creator', attributes: ['id', 'name', 'email'] }],
                },
            ],
        });
    }

    async createUpload(data) {
        return this.SupportUpload.create(data);
    }

    async createHistory(data) {
        return this.SupportHistory.create(data);
    }

    async updateUploadStatus(uploadId, status, comment = null) {
        const upload = await this.SupportUpload.findByPk(uploadId);
        if (!upload) return null;
        upload.status = status;
        upload.comment = comment;
        await upload.save();
        return upload;
    }

    async getHistoryByContract(contractId) {
        return this.SupportHistory.findAll({
            include: [
                {
                    model: this.ContractSupport,
                    as: 'contractSupport', // ✅ alias correcto
                    where: { contractId },
                    attributes: ['id', 'contractId'],
                    include: [
                        {
                            model: this.Support,
                            as: 'support',
                            attributes: ['id', 'support_name', 'description', 'delivery_term'],
                        },
                    ],
                },
                {
                    model: this.SupportUpload,
                    as: 'upload', // ✅ alias correcto según modelo SupportHistory
                    attributes: ['id', 'file_name', 'status', 'createdAt', 'updatedAt'],
                    include: [
                        {
                            model: this.User,
                            as: 'creator', // ✅ alias correcto según modelo SupportUpload
                            attributes: ['id', 'name', 'email'],
                        },
                    ],
                },
                {
                    model: this.UserContractRole,
                    as: 'actor', // ✅ alias correcto según modelo SupportHistory
                    attributes: ['id'],
                    include: [
                        {
                            model: this.User,
                            as: 'user', // ⚠️ Asegúrate de que tu modelo UserContractRole tenga esta asociación
                            attributes: ['id', 'name', 'email'],
                        },
                    ],
                },
            ],
            order: [['createdAt', 'DESC']],
        });
    }
}

module.exports = SupportRepository;
