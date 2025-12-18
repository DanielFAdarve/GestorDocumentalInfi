// src/modules/reports/report.service.js
class ReportService {
    constructor(models) {
        this.models = models;
    }

    async getContractsCompliance() {
        const excludedCodes = ['MOD', 'SUS', 'CES', 'SE', 'AD', 'PROR', 'RP'];

        const contracts = await this.models.Contract.findAll({
            include: [
                {
                    model: this.models.ContractSupport,
                    as: 'supports',
                    include: [
                        { model: this.models.Support, as: 'support' },
                        { model: this.models.SupportUpload, as: 'uploads' }
                    ]
                }
            ]
        });

        return contracts.map(contract => {
            const validSupports = contract.supports.filter(cs => {
                if (!cs.is_required) return false;
                if (excludedCodes.includes(cs.support?.code)) return false;
                return true;
            });

            const total = validSupports.length;
            let completed = 0;

            for (const cs of validSupports) {
                const uploads = cs.uploads || [];

                // Contrato cerrado → acta intercede
                if (['Finalizado_Completo', 'Finalizado_Previo'].includes(contract.status)) {
                    if (uploads.some(u => u.status === 'approved')) {
                        completed++;
                    }
                    continue;
                }

                // Precontractual → fecha <= firma
                if (cs.stage === 'pre_contractual') {
                    if (
                        uploads.some(
                            u =>
                                u.status === 'approved' &&
                                contract.sign_date &&
                                new Date(u.uploaded_at) <= new Date(contract.sign_date)
                        )
                    ) {
                        completed++;
                    }
                    continue;
                }

                // Contractual normal
                if (uploads.some(u => ['approved', 'uploaded'].includes(u.status))) {
                    completed++;
                }
            }

            const compliance =
                total === 0 ? 100 : Math.round((completed / total) * 100);

            return {
                contract_id: contract.id,
                contract_number: contract.contract_number,
                contractor_name: contract.contractor_name,
                status: contract.status,
                start_date: contract.start_date,
                end_date: contract.end_date,
                sign_date: contract.sign_date,
                compliance_percentage: compliance
            };
        });
    }

    async getContractsSupportsCompliance() {
        const excludedCodes = ['MOD', 'SUS', 'CES', 'SE', 'AD', 'PROR', 'RP'];

        const contracts = await this.models.Contract.findAll({
            include: [
                {
                    model: this.models.ContractSupport,
                    as: 'supports',
                    include: [
                        { model: this.models.Support, as: 'support' },
                        { model: this.models.SupportUpload, as: 'uploads' }
                    ]
                }
            ]
        });

        const rows = [];

        for (const contract of contracts) {
            for (const cs of contract.supports) {
                const support = cs.support;

                // excluir no requeridos y excluidos
                if (!cs.is_required) continue;
                if (excludedCodes.includes(support?.code)) continue;

                const uploads = cs.uploads || [];
                let fulfilled = false;
                let reason = 'Pendiente';

                // Contrato cerrado
                if (['Finalizado_Completo', 'Finalizado_Previo'].includes(contract.status)) {
                    fulfilled = uploads.some(u => u.status === 'approved');
                    reason = fulfilled ? 'Cumplido (contrato cerrado)' : 'Pendiente';
                }

                // Precontractual
                else if (cs.stage === 'pre_contractual') {
                    fulfilled = uploads.some(
                        u =>
                            u.status === 'approved' &&
                            contract.sign_date &&
                            new Date(u.uploaded_at) <= new Date(contract.sign_date)
                    );
                    reason = fulfilled
                        ? 'Cumplido (precontractual)'
                        : 'Pendiente';
                }

                // Contractual normal
                else {
                    fulfilled = uploads.some(u =>
                        ['approved', 'uploaded'].includes(u.status)
                    );
                    reason = fulfilled
                        ? 'Cumplido'
                        : 'Pendiente';
                }

                rows.push({
                    contract_id: contract.id,
                    contract_number: contract.contract_number,
                    contract_status: contract.status,

                    support_id: cs.id,
                    support_code: support?.code,
                    support_name: support?.name,
                    support_stage: cs.stage,
                    support_required: cs.is_required,

                    contractor_name: contract.contractor_name,

                    contract_start_date: contract.start_date,
                    contract_end_date: contract.end_date,
                    contract_sign_date: contract.sign_date,

                    support_status: fulfilled ? 'Cumplido' : 'Pendiente',
                    has_upload: uploads.length > 0,
                    approved_uploads: uploads.filter(u => u.status === 'approved').length
                });
            }
        }

        return rows;
    }
}

module.exports = ReportService;
