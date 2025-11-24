const AppError = require('../../core/errors/AppError');
const { uploadBase64ToAzure } = require('../../utils/azureUpload');
const crypto = require("crypto");

class SupportService {
  constructor(supportRepository, models, sequelize) {
    this.models = models; // for ad-hoc queries (Contract, ContractTypeSupport, UserContractRole...)
    this.repo = supportRepository;

    this.sequelize = sequelize;
  }
  //Carga integrada con historico 
  // async uploadEvidenceIntegrated(contractSupportId, payload, creatorUserId) {
  //   const transaction = await this.sequelize.transaction();

  //   try {
  //     // 1. Validar ContractSupport
  //     const cs = await this.models.ContractSupport.findByPk(contractSupportId);
  //     if (!cs) throw new AppError('ContractSupport no encontrado', 404);

  //     // 2. Subir archivo a Azure
  //     const remotePath = `supports/${contractSupportId}/${Date.now()}_${payload.fileName}`;
  //     const azureUrl = await uploadBase64ToAzure(payload.fileBase64, remotePath);

  //     // 3. Crear metadata en BD
  //     const upload = await this.repo.createUpload(
  //       {
  //         contract_support_id: contractSupportId,
  //         users_contract_role_id: payload.uploaderUserContractRoleId,
  //         created_by: creatorUserId,
  //         file_name: payload.fileName,
  //         mime_type: payload.mimeType || null,
  //         azure_url: azureUrl,
  //         comment: payload.comment || null,
  //         uploaded_at: new Date()
  //       },
  //       transaction
  //     );

  //     // 4. Registrar history
  //     await this.repo.createHistory(
  //       {
  //         contract_support_id: contractSupportId,
  //         support_upload_id: upload.id,
  //         event: 'upload_created',
  //         actor_user_id: creatorUserId,
  //         payload: { file_name: payload.fileName }
  //       },
  //       transaction
  //     );

  //     await transaction.commit();
  //     return upload;

  //   } catch (err) {
  //     await transaction.rollback();
  //     throw err;
  //   }
  // }
  async uploadEvidenceIntegrated(contractSupportId, payload, creatorUserId) {
    const transaction = await this.sequelize.transaction();

    try {

      // VALIDACIONES DURAS
      if (!payload) throw new AppError("Payload vacío", 400);

      if (!payload.fileName)
        throw new AppError("fileName es obligatorio", 400);

      if (!payload.fileBase64)
        throw new AppError("fileBase64 es obligatorio", 400);

      if (!payload.uploaderUserContractRoleId)
        throw new AppError("uploaderUserContractRoleId es obligatorio", 400);

      if (!creatorUserId)
        throw new AppError("creatorUserId es obligatorio", 400);

      if (!process.env.AZURE_SHARE_NAME)
        throw new AppError("AZURE_SHARE_NAME no configurado", 500);


      // 1. Validar existencia ContractSupport
      const cs = await this.models.ContractSupport.findByPk(contractSupportId);
      if (!cs) throw new AppError('ContractSupport no encontrado', 404);

      // 2. Subir archivo
      const remotePath = `supports/${contractSupportId}/${Date.now()}_${payload.fileName}`;
      const azureUrl = await uploadBase64ToAzure(payload.fileBase64, remotePath);

      if (!azureUrl) throw new AppError("No se pudo subir el archivo a Azure", 500);

      // 3. Hash
      const fileBuffer = Buffer.from(payload.fileBase64, 'base64');
      const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

      // 4. Crear metadata
      const upload = await this.repo.createUpload({
        contract_support_id: contractSupportId,
        users_contract_role_id: payload.uploaderUserContractRoleId,
        created_by: creatorUserId,
        file_name: "payload.fileName",
        mime_type: payload.mimeType || null,

        file_hash: "1",
        azure_container: "process.env.AZURE_SHARE_NAME",
        azure_blob_path: "1",
        azure_url: azureUrl,

        comment: payload.comment || null,
        uploaded_at: new Date()

      }, transaction);

      //  const upload = await this.repo.createUpload({
      //   contract_support_id: contractSupportId,
      //   users_contract_role_id: payload.uploaderUserContractRoleId,
      //   created_by: creatorUserId,
      //   file_name: payload.fileName,
      //   mime_type: payload.mimeType || null,

      //   file_hash: fileHash,
      //   azure_container: process.env.AZURE_SHARE_NAME,
      //   azure_blob_path: remotePath,
      //   azure_url: azureUrl,

      //   comment: payload.comment || null,
      //   uploaded_at: new Date()

      // }, transaction);
      // 5. Historial
      await this.repo.createHistory({
        contract_support_id: contractSupportId,
        support_upload_id: upload.id,
        event: 'upload_created',
        actor_user_id: creatorUserId,
        payload: { file_name: payload.fileName }
      }, transaction);

      await transaction.commit();
      return upload;

    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
  // async uploadEvidenceIntegrated(contractSupportId, payload, creatorUserId) {
  //   const transaction = await this.sequelize.transaction();

  //   try {
  //     // =============================
  //     // 1. Suavizar validaciones
  //     // =============================
  //     const safePayload = payload || {};

  //     const safeFileName = safePayload.fileName || "archivo_default.pdf";
  //     const safeBase64 = safePayload.fileBase64 || Buffer.from("VACIO").toString("base64");
  //     const safeMime = safePayload.mimeType || "application/octet-stream";

  //     const safeUploaderRoleId =
  //       safePayload.uploaderUserContractRoleId || 1; // valor por defecto

  //     const safeCreator =
  //       creatorUserId || 1; // por si viene null

  //     const container =
  //       process.env.AZURE_SHARE_NAME || "default_container";

  //     // =============================
  //     // 2. Validar contract_support
  //     // =============================
  //     const cs = await this.models.ContractSupport.findByPk(contractSupportId);
  //     if (!cs) throw new AppError("ContractSupport no encontrado", 404);

  //     // =============================
  //     // 3. Subida a Azure (si falla, no frena)
  //     // =============================
  //     let remotePath = `supports/${contractSupportId}/${Date.now()}_${safeFileName}`;
  //     let azureUrl = null;

  //     try {
  //       azureUrl = await uploadBase64ToAzure(safeBase64, remotePath);
  //     } catch (err) {
  //       // NO hacemos throw → cargamos igual
  //       remotePath = "default_path";
  //       azureUrl = "https://fake-url.local/default.pdf";
  //     }

  //     // =============================
  //     // 4. Generar hash (o default)
  //     // =============================
  //     let fileHash = "hash_default";
  //     try {
  //       const buffer = Buffer.from(safeBase64, "base64");
  //       fileHash = crypto.createHash("sha256").update(buffer).digest("hex");
  //     } catch (_) { }

  //     let data=  {
  //         contract_support_id: contractSupportId,
  //         users_contract_role_id: safeUploaderRoleId,
  //         created_by: safeCreator,

  //         file_name: safeFileName,
  //         mime_type: safeMime,

  //         file_hash: fileHash,
  //         azure_container: container,
  //         azure_blob_path: remotePath,
  //         azure_url: azureUrl,

  //         comment: safePayload.comment || null,
  //         uploaded_at: new Date()
  //       }
  //       console.log(data);
  //     // =============================
  //     // 5. Insertar upload real
  //     // =============================
  //     const upload = await this.repo.createUpload(
  //       {
  //         contract_support_id: contractSupportId,
  //         users_contract_role_id: safeUploaderRoleId,
  //         created_by: safeCreator,

  //         file_name: safeFileName,
  //         mime_type: safeMime,

  //         file_hash: fileHash,
  //         azure_container: container,
  //         azure_blob_path: remotePath,
  //         azure_url: azureUrl,

  //         comment: safePayload.comment || null,
  //         uploaded_at: new Date()
  //       },
  //       transaction
  //     );

  //     // =============================
  //     // 6. Historial
  //     // =============================
  //     await this.repo.createHistory(
  //       {
  //         contract_support_id: contractSupportId,
  //         support_upload_id: upload.id,
  //         event: "upload_created",
  //         actor_user_id: safeCreator,
  //         payload: { file_name: safeFileName }
  //       },
  //       transaction
  //     );

  //     await transaction.commit();
  //     return upload;

  //   } catch (err) {
  //     await transaction.rollback();
  //     throw err;
  //   }
  // }
  async generateForContract(contract) {
    // contract: row completo o id. Allow both.
    const contractId = typeof contract === 'object' ? contract.id : contract;
    const contractRow = typeof contract === 'object' ? contract : await this.models.Contract.findByPk(contractId);
    if (!contractRow) throw new AppError('Contrato no encontrado', 404);

    const contractTypeId = contractRow.contract_type_id;

    const rules = await this.models.ContractTypeSupport.findAll({ where: { contract_type_id: contractTypeId } });
    if (!rules || rules.length === 0) return [];

    // Build rows
    const rows = rules.map(r => ({
      contract_id: contractId,
      support_id: r.support_id,
      stage: r.stage,
      is_required: r.is_required,
      order: r.order || 0,
      status: 'pending',
      createdBy: null
    }));

    const transaction = await this.sequelize.transaction();
    try {
      const created = await this.repo.bulkCreateContractSupports(rows, transaction);

      // Optionally: create initial history entries
      for (const cs of created) {
        await this.repo.createHistory({
          contract_support_id: cs.id,
          event: 'requirement_created',
          payload: { by: 'system' }
        }, transaction);
      }

      await transaction.commit();
      return created;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
  
  async listByContract(contractId) {
    return this.models.ContractSupport.findAll({
      where: { contract_id: contractId },
      include: [
        { model: this.models.Support, as: 'support' },
        { model: this.models.User, as: 'responsible' },
        { model: this.models.SupportUpload, as: 'uploads' }
      ]
    });
  }

  async assignResponsible(contractSupportId, userId, actorUserId = null) {
    const uc = await this.models.User.findByPk(userId);
    if (!uc) throw new AppError('Usuario no encontrado', 404);

    const updated = await this.repo.setResponsible(contractSupportId, userId);
    if (!updated) throw new AppError('ContractSupport no encontrado', 404);

    await this.repo.createHistory({
      contract_support_id: contractSupportId,
      event: 'assign_responsible',
      actor_user_id: actorUserId,
      payload: { newResponsible: userId }
    });

    return updated;
  }

  async uploadEvidence(contractSupportId, uploaderUserContractRoleId, creatorUserId, fileMeta) {
    const transaction = await this.sequelize.transaction();
    try {
      const upload = await this.repo.createUpload({
        contract_support_id: contractSupportId,
        users_contract_role_id: uploaderUserContractRoleId,
        created_by: creatorUserId,
        ...fileMeta,
        uploaded_at: new Date()
      }, transaction);

      await this.repo.createHistory({
        contract_support_id: contractSupportId,
        support_upload_id: upload.id,
        event: 'upload_created',
        actor_user_id: creatorUserId,
        payload: { file_hash: fileMeta.file_hash, file_name: fileMeta.file_name }
      }, transaction);

      await transaction.commit();
      return upload;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async getUploads(contractSupportId) {
    return this.repo.findUploadsByContractSupport(contractSupportId);
  }

  async getHistory(contractSupportId) {
    return this.models.SupportHistory.findAll({
      where: { contract_support_id: contractSupportId },
      order: [['created_at', 'DESC']]
    });
  }

  async updateContractSupportStatus(contractSupportId, status, actorId = null) {
    const allowed = ['pending', 'uploaded', 'approved', 'rejected', 'overdue'];
    if (!allowed.includes(status)) throw new AppError('Estado no permitido', 400);

    const updated = await this.repo.updateContractSupportStatus(contractSupportId, { status });
    if (!updated) throw new AppError('ContractSupport no encontrado', 404);

    await this.repo.createHistory({
      contract_support_id: contractSupportId,
      event: 'status_changed',
      actor_user_id: actorId,
      payload: { status }
    });

    return updated;
  }

  async updateUploadPortalStatus(uploadId, { secop_status, sia_status }, actorId = null) {
    const updated = await this.repo.updateUpload(uploadId, { secop_status, sia_status });
    if (!updated) throw new AppError('Upload no encontrado', 404);

    await this.repo.createHistory({
      support_upload_id: uploadId,
      event: 'portal_status_changed',
      actor_user_id: actorId,
      payload: { secop_status, sia_status }
    });

    return updated;
  }
}

module.exports = SupportService;
