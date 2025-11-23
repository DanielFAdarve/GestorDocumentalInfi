class SupportRepository {
    constructor(models) {
        this.ContractSupport = models.ContractSupport;
        this.ContractTypeSupport = models.ContractTypeSupport;
        this.UserContractRole = models.UserContractRole;
        this.SupportUpload = models.SupportUpload;
        this.SupportHistory = models.SupportHistory;
        this.User = models.User;
        this.Support = models.Support;
    }

    // Obtener soportes de un contrato
    async findByContract(contractId) {
        return this.ContractSupport.findAll({
            where: { contract_id: contractId },
            include: [
                { model: this.Support, as: 'support' }
            ].filter(Boolean)
        });
    }

    // Obtener reglas por contract_type
    async findRulesByContractType(contractTypeId) {
        return this.ContractTypeSupport.findAll({ where: { contract_type_id: contractTypeId } });
    }

    // Bulk crear contract supports (evita duplicados por contrato+support)
    async bulkCreateContractSupports(rows, transaction = null) {
        // dedupe in JS before DB
        const uniq = new Map();
        rows.forEach(r => uniq.set(`${r.contract_id}:${r.support_id}`, r));
        const toInsert = Array.from(uniq.values());
        return this.ContractSupport.bulkCreate(toInsert, { ignoreDuplicates: true, transaction });
    }

    // Asignar responsable a un ContractSupport
    async setResponsible(contractSupportId, userId) {
        const cs = await this.ContractSupport.findByPk(contractSupportId);
        if (!cs) return null;
        return cs.update({ responsible_user_id: userId });
    }

    // Crear metadata de upload
    async createUpload(payload, transaction = null) {
        return this.SupportUpload.create(payload, { transaction });
    }

    // Obtener uploads por contract support
    async findUploadsByContractSupport(contractSupportId) {
        return this.SupportUpload.findAll({ where: { contract_support_id: contractSupportId }, order: [['uploaded_at', 'DESC']] });
    }

    // Crear evento historial
    async createHistory(payload, transaction = null) {
        return this.SupportHistory.create(payload, { transaction });
    }

    // Actualizar contract support status
    async updateContractSupportStatus(id, updates) {
        const cs = await this.ContractSupport.findByPk(id);
        if (!cs) return null;
        return cs.update(updates);
    }

    // Actualizar upload portal status
    async updateUpload(id, updates) {
        const up = await this.SupportUpload.findByPk(id);
        if (!up) return null;
        return up.update(updates);
    }
}

module.exports = SupportRepository;
