class ContractActivityRepository {
  constructor(models) {
    this.models = models;
  }

  async log(data, transaction = null) {
    return this.models.ContractActivityReport.create(data, { transaction });
  }

  async findByContract(contractId) {
    return this.models.ContractActivityReport.findAll({
      where: { contractId },
      include: [{ model: this.models.ContractActivityReportItem, as: 'items' }]
    });
  }
}

module.exports = ContractActivityRepository;
