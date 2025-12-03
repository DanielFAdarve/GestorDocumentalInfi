const AppError = require('../../core/errors/AppError');

class ContractService {
  constructor(
    contractRepository,
    obligationRepository,
    fileRepository,
    sequelize
  ) {
    this.contractRepository = contractRepository;
    this.obligationRepository = obligationRepository;
    this.fileRepository = fileRepository;
    this.sequelize = sequelize;
  }

  // ============================
  // GETTERS
  // ============================

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
    if (!contract.length) throw new AppError('No hay contratos para la empresa', 404);
    return contract;
  }

  // ============================
  // CREAR CONTRATO COMPLETO
  // ============================

  async createContract(data) {
    const transaction = await this.sequelize.transaction();

    try {
      // 1. Crear registro en Contracts
      const contract = await this.contractRepository.create(data, transaction);

      // 2. Asignar responsable con rol fijo 2
      await this.contractRepository.assignUserRole(
        contract.id,
        data.userId,
        2,
        transaction
      );

      // 3. Obligaciones
      if (Array.isArray(data.obligations) && data.obligations.length > 0) {
        await this.obligationRepository.bulkCreate(
          contract.id,
          data.obligations.map(o => ({
            description: o.description,
            type: o.type,
            periodicity: o.periodicity ?? null,
            due_date: o.due_date
          })),
          transaction
        );
      }

      // 4. Archivos
      if (Array.isArray(data.files) && data.files.length > 0) {
        await this.fileRepository.bulkCreate(
          contract.id,
          data.files.map(f => ({
            originalname: f.file_name,
            blobUrl: f.file_path
          })),
          transaction
        );
      }

      await transaction.commit();
      return contract;

    } catch (error) {
      await transaction.rollback();
      throw new AppError(
        'Error al crear el contrato: ' + error.message,
        500
      );
    }
  }

  // ============================
  // UPDATE
  // ============================

  async updateContract(id, updates) {
    const transaction = await this.sequelize.transaction();

    try {
      const updated = await this.contractRepository.update(id, updates);

      if (!updated) {
        await transaction.rollback();
        throw new AppError('Contrato no encontrado', 404);
      }

      // Obligaciones
      if (Array.isArray(updates.obligations)) {
        await this.obligationRepository.replaceForContract(
          id,
          updates.obligations.map(o => ({
            description: o.description,
            type: o.type,
            periodicity: o.periodicity ?? null,
            due_date: o.due_date
          })),
          transaction
        );
      }

      // Archivos
      if (Array.isArray(updates.files)) {
        await this.fileRepository.replaceForContract(
          id,
          updates.files.map(f => ({
            originalname: f.file_name,
            blobUrl: f.file_path
          })),
          transaction
        );
      }

      await transaction.commit();
      return updated;

    } catch (err) {
      await transaction.rollback();
      throw new AppError('Error actualizando contrato: ' + err.message, 500);
    }
  }

  // ============================
  // DELETE
  // ============================

  async deleteContract(id) {
    const deleted = await this.contractRepository.delete(id);
    if (!deleted) throw new AppError('Contrato no encontrado', 404);
    return { message: 'Contrato eliminado correctamente' };
  }

  // ============================
  // FILTROS Y REPORTES
  // ============================

  async filterContracts(field, value) {
    return this.contractRepository.filter(field, value);
  }

  async reportGeneral() {
    return this.contractRepository.reportGeneral();
  }

  async reportById(id) {
    const contract = await this.contractRepository.reportById(id);
    if (!contract) throw new AppError('Contrato no encontrado', 404);
    return contract;
  }

  async reportByStatus(status) {
    return this.contractRepository.reportByStatus(status);
  }

  async reportByDependency(dep) {
    return this.contractRepository.reportByDependency(dep);
  }

  async reportNearToExpire(days) {
    return this.contractRepository.reportNearToExpire(days);
  }

  async reportExpired() {
    return this.contractRepository.reportExpired();
  }
}

module.exports = ContractService;
