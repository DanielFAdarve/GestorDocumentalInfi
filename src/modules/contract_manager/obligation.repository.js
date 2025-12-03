// src/modules/contract/obligation.repository.js

class ObligationRepository {
  constructor(models) {
    this.Obligation = models.Obligation;
    this.Contract = models.Contract;
  }

  async findByContract(contractId) {
    return this.Obligation.findAll({ where: { contractId } });
  }

  async create(data, transaction) {
    return this.Obligation.create(data, { transaction });
  }

  async update(id, data, transaction) {
    return this.Obligation.update(data, { where: { id }, transaction });
  }

  async delete(id, transaction) {
    return this.Obligation.destroy({ where: { id }, transaction });
  }

  async deleteByContract(contractId, transaction) {
    return this.Obligation.destroy({ where: { contractId }, transaction });
  }
}

module.exports = ObligationRepository;
