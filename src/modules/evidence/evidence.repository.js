class EvidenceRepository {
  constructor({ SupportUpload, ContractSupport, Support, User }) {
    this.SupportUpload = SupportUpload;
    this.ContractSupport = ContractSupport;
    this.Support = Support;
    this.User = User;
  }

  /**
   * Obtiene las evidencias con estado "pending" para un contrato.
   */
  async findPendingByContract(contractId) {
    return this.SupportUpload.findAll({
      include: [
        {
          model: this.ContractSupport,
          as: 'contractSupport',
          required: true,
          where: { contractId },
          include: [
            {
              model: this.Support,
              as: 'support',
              attributes: ['id', 'support_name', 'description'],
            },
          ],
        },
        {
          model: this.User,
          as: 'creator',
          attributes: ['id', 'name', 'email'],
        },
      ],
      where: { status: 'pending' },
      order: [['uploaded_at', 'DESC']],
    });
  }
}

module.exports = EvidenceRepository;
