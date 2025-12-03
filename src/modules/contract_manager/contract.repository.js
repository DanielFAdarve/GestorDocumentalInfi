// src/modules/contract/contract.repository.js

class ContractRepository {
  constructor(Contract, UserContractRole) {
    this.Contract = Contract;
    this.UserContractRole = UserContractRole;
  }

  async findAll() {
    return this.Contract.findAll({
      include: [{ model: this.UserContractRole, as: "userContractRoles" }],
    });
  }

  async findById(id) {
    return this.Contract.findByPk(id, {
      include: [{ model: this.UserContractRole, as: "userContractRoles" }],
    });
  }

  async create(data, transaction) {
    return this.Contract.create(data, { transaction });
  }

  async update(id, data, transaction) {
    return this.Contract.update(data, { where: { id }, transaction });
  }

  async delete(id, transaction) {
    return this.Contract.destroy({ where: { id }, transaction });
  }
}

module.exports = ContractRepository;
