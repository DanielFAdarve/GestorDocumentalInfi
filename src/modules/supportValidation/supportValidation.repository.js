// src/modules/supportValidation/supportValidation.repository.js

class SupportValidationRepository {
  constructor({ Contract, Resolution, ResolutionSupport, Support, ContractSupport }) {
    this.Contract = Contract;
    this.Resolution = Resolution;
    this.ResolutionSupport = ResolutionSupport;
    this.Support = Support;
    this.ContractSupport = ContractSupport;
  }

  /**
   * Obtiene la resolución y los soportes asociados a un contrato.
   */
  async findResolutionAndSupports(contractId) {
    const contract = await this.Contract.findByPk(contractId, {
      include: [
        {
          model: this.Resolution,
          as: 'resolution',
          include: [
            {
              model: this.Support,
              as: 'supports',
              through: { attributes: [] },
            },
          ],
        },
      ],
    });

    if (!contract) return null;

    // Buscar los soportes ya cargados (ContractSupport)
    const uploadedSupports = await this.ContractSupport.findAll({
      where: { contractId },
      attributes: ['supportId', 'status'],
    });

    const uploadedMap = new Map(uploadedSupports.map(s => [s.supportId, s.status]));

    return {
      contractId: contract.id,
      resolution: contract.resolution,
      supports: (contract.resolution?.supports || []).map(support => ({
        id: support.id,
        name: support.support_name,
        description: support.description,
        delivery_term: support.delivery_term,
        status: uploadedMap.get(support.id) || 'pending',
      })),
    };
  }
}

module.exports = SupportValidationRepository;
