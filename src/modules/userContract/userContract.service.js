// services/userContractRoleService.js
const AppError = require('../utils/AppError');

class UserContractRoleService {
  constructor(userContractRoleRepository) {
    this.userContractRoleRepository = userContractRoleRepository;
  }

  async create(data) {
    const { userId, contractId } = data;
    const existing = await this.userContractRoleRepository.findByUserAndContract(userId, contractId);
    if (existing) throw new AppError('El usuario ya está asignado a este contrato', 400);

    return await this.userContractRoleRepository.create(data);
  }

  async getAll() {
    return await this.userContractRoleRepository.findAll();
  }

  async getById(id) {
    const record = await this.userContractRoleRepository.findById(id);
    if (!record) throw new AppError('Relación no encontrada', 404);
    return record;
  }

  async update(id, data) {
    const record = await this.userContractRoleRepository.update(id, data);
    if (!record) throw new AppError('No se encontró la relación para actualizar', 404);
    return record;
  }

  async delete(id) {
    const result = await this.userContractRoleRepository.delete(id);
    if (!result) throw new AppError('No se encontró la relación para eliminar', 404);
    return true;
  }
}

module.exports = UserContractRoleService;
