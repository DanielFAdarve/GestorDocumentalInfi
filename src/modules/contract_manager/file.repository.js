// src/modules/contract/file.repository.js

class FileRepository {
  constructor(models) {
    this.ContractFile = models.ContractFile;
    this.ContractPeriod = models.ContractPeriod;
    this.ContractAttachment = models.ContractAttachment;
  }

  // Files
  async findFilesByContract(contractId) {
    return this.ContractFile.findAll({ where: { contractId } });
  }

  async createFile(data, transaction) {
    return this.ContractFile.create(data, { transaction });
  }

  async deleteFilesByContract(contractId, transaction) {
    return this.ContractFile.destroy({ where: { contractId }, transaction });
  }

  // Periods
  async findPeriodsByContract(contractId) {
    return this.ContractPeriod.findAll({ where: { contractId } });
  }

  async createPeriod(data, transaction) {
    return this.ContractPeriod.create(data, { transaction });
  }

  async deletePeriodsByContract(contractId, transaction) {
    return this.ContractPeriod.destroy({ where: { contractId }, transaction });
  }

  // Attachments
  async findAttachmentsByContract(contractId) {
    return this.ContractAttachment.findAll({ where: { contractId } });
  }

  async createAttachment(data, transaction) {
    return this.ContractAttachment.create(data, { transaction });
  }

  async deleteAttachmentsByContract(contractId, transaction) {
    return this.ContractAttachment.destroy({ where: { contractId }, transaction });
  }
}

module.exports = FileRepository;
