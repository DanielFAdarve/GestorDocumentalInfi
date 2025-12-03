// src/modules/contract/contract.service.js
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

  async getAll() {
    return this.contractRepository.findAll();
  }

  async getById(id) {
    const contract = await this.contractRepository.findById(id);
    if (!contract) throw new AppError("Contrato no encontrado", 404);
    return contract;
  }

  async createContract(data) {
    return this.sequelize.transaction(async (t) => {
      const contract = await this.contractRepository.create(data.contract, t);

      // Obligations
      if (data.obligations?.length) {
        for (const ob of data.obligations) {
          await this.obligationRepository.create(
            { ...ob, contractId: contract.id },
            t
          );
        }
      }

      // Files
      if (data.files?.length) {
        for (const file of data.files) {
          await this.fileRepository.createFile(
            { ...file, contractId: contract.id },
            t
          );
        }
      }

      // Periods
      if (data.periods?.length) {
        for (const p of data.periods) {
          await this.fileRepository.createPeriod(
            { ...p, contractId: contract.id },
            t
          );
        }
      }

      // Attachments
      if (data.attachments?.length) {
        for (const a of data.attachments) {
          await this.fileRepository.createAttachment(
            { ...a, contractId: contract.id },
            t
          );
        }
      }

      return contract;
    });
  }

  async updateContract(id, data) {
    return this.sequelize.transaction(async (t) => {
      const exists = await this.contractRepository.findById(id);
      if (!exists) throw new AppError("Contrato no encontrado", 404);

      await this.contractRepository.update(id, data.contract, t);

      // Cleanup related tables
      await this.obligationRepository.deleteByContract(id, t);
      await this.fileRepository.deleteFilesByContract(id, t);
      await this.fileRepository.deletePeriodsByContract(id, t);
      await this.fileRepository.deleteAttachmentsByContract(id, t);

      // Reinserts
      if (data.obligations)
        for (const ob of data.obligations)
          await this.obligationRepository.create(
            { ...ob, contractId: id },
            t
          );

      if (data.files)
        for (const file of data.files)
          await this.fileRepository.createFile({ ...file, contractId: id }, t);

      if (data.periods)
        for (const p of data.periods)
          await this.fileRepository.createPeriod({ ...p, contractId: id }, t);

      if (data.attachments)
        for (const a of data.attachments)
          await this.fileRepository.createAttachment(
            { ...a, contractId: id },
            t
          );

      return true;
    });
  }

  async deleteContract(id) {
    return this.sequelize.transaction(async (t) => {
      const exists = await this.contractRepository.findById(id);
      if (!exists) throw new AppError("Contrato no encontrado", 404);

      await this.obligationRepository.deleteByContract(id, t);
      await this.fileRepository.deleteFilesByContract(id, t);
      await this.fileRepository.deletePeriodsByContract(id, t);
      await this.fileRepository.deleteAttachmentsByContract(id, t);
      await this.contractRepository.delete(id, t);

      return true;
    });
  }
}

module.exports = ContractService;
