const crypto = require('crypto');
const AppError = require('../../core/errors/AppError');
const { uploadBase64ToAzure } = require('../../utils/azureUpload');

class SupportService {
  constructor(supportRepository) {
    this.supportRepository = supportRepository;
  }

  async listSupports(contractId) {
    const supports = await this.supportRepository.findSupportsByContract(contractId);
    if (!supports || supports.length === 0)
      throw new AppError('No se encontraron soportes para este contrato', 404);
    return { message: 'Soportes obtenidos correctamente', data: supports };
  }

  /**
   * Sube un soporte al almacenamiento Azure y lo registra en la base de datos.
   * Si el contractSupportId no existe, se crea automáticamente en la tabla ContractSupport.
   */
  async uploadSupport({
    contractSupportId,
    base64File,
    fileName,
    createdBy,
    usersContractId,
    contractId,   // <-- debe venir si se crea un ContractSupport nuevo
    supportId,    // <-- igual
  }) {
    const fileHash = crypto.createHash('sha256').update(base64File).digest('hex');

    // 1️⃣ Verificar si existe el ContractSupport
    let contractSupport = null;
    if (contractSupportId) {
      contractSupport = await this.supportRepository.ContractSupport.findByPk(contractSupportId);
    }

    // 2️⃣ Si no existe, crear uno nuevo
    if (!contractSupport) {
      if (!contractId || !supportId) {
        throw new AppError(
          'El contractSupportId no existe y no se proporcionaron contractId ni supportId para crearlo.',
          400
        );
      }

      contractSupport = await this.supportRepository.ContractSupport.create({
        contractId,
        supportId,
        userId: createdBy,
        status: 'pending',
      });

      contractSupportId = contractSupport.id;
    }

    // 3️⃣ Subir archivo a Azure
    const remotePath = `supports/${contractSupportId}/${fileHash}_${fileName}`;
    const fileUrl = await uploadBase64ToAzure(base64File, remotePath);

    // 4️⃣ Registrar el soporte en la tabla SupportUpload
    const upload = await this.supportRepository.createUpload({
      contractSupportId,
      usersContractId,
      file_name: fileName,
      file_hash: fileHash,
      createdBy,
    });

    // 5️⃣ Crear registro de historial
    await this.supportRepository.createHistory({
      supportUploadId: upload.id,
      contractSupportId,
      usersContractId,
      status: 'pending',
      comment: 'Soporte cargado correctamente en Azure Storage',
    });

    return {
      message: 'Soporte subido exitosamente',
      data: { upload, fileUrl, contractSupportId },
    };
  }

  async updateStatus(uploadId, status, comment, usersContractId) {
    const upload = await this.supportRepository.updateUploadStatus(uploadId, status, comment);
    if (!upload) throw new AppError('Soporte no encontrado', 404);

    await this.supportRepository.createHistory({
      supportUploadId: upload.id,
      contractSupportId: upload.contractSupportId,
      usersContractId,
      status,
      comment,
    });

    return { message: 'Estado del soporte actualizado correctamente', data: upload };
  }

  async getHistory(contractId, contractSupportId = null) {
    const history = contractSupportId
      ? await this.supportRepository.getHistoryBySupport(contractSupportId)
      : await this.supportRepository.getHistoryByContract(contractId);

    if (!history.length)
      throw new AppError('No existe historial para este contrato o soporte', 404);

    return { message: 'Histórico obtenido correctamente', data: history };
  }
}

module.exports = SupportService;
