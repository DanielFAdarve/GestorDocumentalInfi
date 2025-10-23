// repositories/userContractRoleRepository.js
class UserContractRoleRepository {
  constructor({ UserContractRole, User, Contract, Role }) {
    this.model = UserContractRole;
    this.User = User;
    this.Contract = Contract;
    this.Role = Role;
  }

  async create(data) {
    return await this.model.create(data);
  }

  async findAll() {
    return await this.model.findAll({
      include: [
        { model: this.User, as: 'user' },
        { model: this.Contract, as: 'contract' },
        { model: this.Role, as: 'role' },
      ],
    });
  }

  async findById(id) {
    return await this.model.findByPk(id, {
      include: [
        { model: this.User, as: 'user' },
        { model: this.Contract, as: 'contract' },
        { model: this.Role, as: 'role' },
      ],
    });
  }

  async findByUserAndContract(userId, contractId) {
    return await this.model.findOne({ where: { userId, contractId } });
  }

  async update(id, data) {
    const record = await this.model.findByPk(id);
    if (!record) return null;
    return await record.update(data);
  }

  async delete(id) {
    const record = await this.model.findByPk(id);
    if (!record) return null;
    await record.destroy();
    return true;
  }
}

module.exports = UserContractRoleRepository;
