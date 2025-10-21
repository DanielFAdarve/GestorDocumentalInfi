class ContractRepository {
  constructor(ContractModel, UserContractRoleModel) {
    this.Contract = ContractModel;
    this.UserContractRole = UserContractRoleModel;
  }

  async findAll() {
    return this.Contract.findAll({ include: ['company', 'resolution', 'users'] });
  }

  async findById(id) {
    return this.Contract.findByPk(id, { include: ['company', 'resolution', 'users'] });
  }

  async create(contractData, transaction = null) {
    return this.Contract.create(contractData, { transaction });
  }

  async update(id, updates) {
    const contract = await this.findById(id);
    if (!contract) return null;
    return contract.update(updates);
  }

  async delete(id) {
    const contract = await this.findById(id);
    if (!contract) return null;
    await contract.destroy();
    return true;
  }

  async assignUserRole(contractId, userId, roleId, transaction = null) {
    return this.UserContractRole.create(
      { contractId, userId, roleId },
      { transaction }
    );
  }
}

module.exports = ContractRepository;
