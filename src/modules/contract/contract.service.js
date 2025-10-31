const AppError = require('../../core/errors/AppError');

class ContractService {
  constructor(contractRepository, sequelize) {
    this.contractRepository = contractRepository;
    this.sequelize = sequelize;
  }

  async getAllContracts() {
    return this.contractRepository.findAll();
  }

  async getContractById(id) {
    const contract = await this.contractRepository.findById(id);
    if (!contract) throw new AppError('Contrato no encontrado', 404);
    return contract;
  }
  async getContractByCompanyId(id) {
    const contract = await this.contractRepository.findByCompanyId(id);
    if (!contract) throw new AppError('No hay contratos para la compañia relacionada', 404);
    return contract;
  }
  async createContract(data) {
    const transaction = await this.sequelize.transaction();
    
    try {
      const contract = await this.contractRepository.create(data, transaction);

      // Asignar automáticamente el usuario contratista con rol fijo 2
      await this.contractRepository.assignUserRole(contract.id, data.userId, 2, transaction);

      await transaction.commit();
      return contract;
    } catch (error) {
      await transaction.rollback();
      throw new AppError('Error al crear el contrato: ' + error.message, 500);
    }
  }

  async updateContract(id, updates) {
    const contract = await this.contractRepository.update(id, updates);
    if (!contract) throw new AppError('Contrato no encontrado', 404);
    return contract;
  }

  async deleteContract(id) {
    const deleted = await this.contractRepository.delete(id);
    if (!deleted) throw new AppError('Contrato no encontrado', 404);
    return { message: 'Contrato eliminado correctamente' };
  }

  async filterContracts(field, value) {
    return this.contractRepository.filter(field, value);
  }
}

module.exports = ContractService;
