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
    try {
      const contracts = await this.contractRepository.findAll();
      return { success: true, data: contracts };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async getById(id) {
    try {
      const contract = await this.contractRepository.findById(id);
      if (!contract) return { success: false, message: "Contrato no encontrado" };

      return { success: true, data: contract };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async createContract(data) {
    try {
      const result = await this.sequelize.transaction(async (t) => {
        const contract = await this.contractRepository.create(data.contract, t);

        if (data.obligations?.length) {
          for (const ob of data.obligations)
            await this.obligationRepository.create({ ...ob, contractId: contract.id }, t);
        }

        if (data.files?.length) {
          for (const file of data.files)
            await this.fileRepository.createFile({ ...file, contractId: contract.id }, t);
        }

        if (data.periods?.length) {
          for (const p of data.periods)
            await this.fileRepository.createPeriod({ ...p, contractId: contract.id }, t);
        }

        if (data.attachments?.length) {
          for (const a of data.attachments)
            await this.fileRepository.createAttachment({ ...a, contractId: contract.id }, t);
        }

        return contract;
      });

      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async updateContract(id, data) {
    try {
      const exists = await this.contractRepository.findById(id);
      if (!exists) return { success: false, message: "Contrato no encontrado" };

      await this.sequelize.transaction(async (t) => {
        await this.contractRepository.update(id, data.contract, t);

        await this.obligationRepository.deleteByContract(id, t);
        await this.fileRepository.deleteFilesByContract(id, t);
        await this.fileRepository.deletePeriodsByContract(id, t);
        await this.fileRepository.deleteAttachmentsByContract(id, t);

        if (data.obligations)
          for (const ob of data.obligations)
            await this.obligationRepository.create({ ...ob, contractId: id }, t);

        if (data.files)
          for (const file of data.files)
            await this.fileRepository.createFile({ ...file, contractId: id }, t);

        if (data.periods)
          for (const p of data.periods)
            await this.fileRepository.createPeriod({ ...p, contractId: id }, t);

        if (data.attachments)
          for (const a of data.attachments)
            await this.fileRepository.createAttachment({ ...a, contractId: id }, t);
      });

      return { success: true, data: "Contrato actualizado correctamente" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async deleteContract(id) {
    try {
      const exists = await this.contractRepository.findById(id);
      if (!exists) return { success: false, message: "Contrato no encontrado" };

      await this.sequelize.transaction(async (t) => {
        await this.obligationRepository.deleteByContract(id, t);
        await this.fileRepository.deleteFilesByContract(id, t);
        await this.fileRepository.deletePeriodsByContract(id, t);
        await this.fileRepository.deleteAttachmentsByContract(id, t);
        await this.contractRepository.delete(id, t);
      });

      return { success: true, message: "Contrato eliminado correctamente" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async filter(field, value) {
    try {
      const allowedFields = ['contract_number', 'company_id', 'status'];
      if (!allowedFields.includes(field))
        return { success: false, message: `No puede filtrar por el campo: ${field}` };

      const contracts = await this.contractRepository.filter(field, value);
      return { success: true, data: contracts };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

module.exports = ContractService;
