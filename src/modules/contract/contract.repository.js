class ContractRepository {
  constructor(ContractModel, UserContractRoleModel) {
    this.Contract = ContractModel;
    this.UserContractRole = UserContractRoleModel;
  }

  async findAll() {
    // return this.Contract.findAll({ include: ['company', 'resolution', 'users'] });
        return this.Contract.findAll();
  }

  async findById(id) {
    // return this.Contract.findByPk(id, { include: ['company', 'resolution', 'users'] });
       return this.Contract.findByPk(id);
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

  async filter(field, value) {
    const allowedFields = [
      'dependency',
      'contract_number',
      'contract_type',
      'status',
      'companyId',
      'userId'
    ];


    if (!allowedFields.includes(field)) {
      throw new Error(`Campo no permitido para filtrar: ${field}`);
    }


    const where = {};
    where[field] = value;

    return this.Contract.findAll({
      where,
      // include: ['company', 'resolution', 'users']
    });
  }
}

module.exports = ContractRepository;
