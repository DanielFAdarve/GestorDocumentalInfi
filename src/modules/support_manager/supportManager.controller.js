const Response = require('../../core/models/Response.model');
const { uploadEvidenceSchema } = require('./supportUpload.schema');

class SupportController {
    constructor(supportService) {
        this.service = supportService;
    }
    //Carga la evidencia y registra el upload
    uploadEvidenceIntegrate = async (req, res, next) => {
        console.log("AQUI entro ")
        try {
            const { contractSupportId } = req.params;

            const validated = uploadEvidenceSchema.parse(req.body);
            const creatorUserId = req.user?.id || null;
            
            const result = await this.service.uploadEvidenceIntegrated(
                contractSupportId,
                validated,
                validated.creatorUserId
            );

            return res
                .status(201)
                .json(Response.success('Archivo cargado y registrado', result, 201));

        } catch (err) {
            next(err);
        }
    };
    // POST /supports/generate/:contractId
    generateForContract = async (req, res, next) => {
        try {
            const { contractId } = req.params;
            const created = await this.service.generateForContract(contractId);
            return res.status(201).json(Response.success('Contract supports generados', created, 201));
        } catch (err) { next(err); }
    };

    // GET /contracts/:contractId/supports
    listByContract = async (req, res, next) => {
        try {
            const { contractId } = req.params;
            const list = await this.service.listByContract(contractId);
            return res.status(200).json(Response.success('Supports list', list));
        } catch (err) { next(err); }
    };

    // POST /supports/:contractSupportId/assign
    assignResponsible = async (req, res, next) => {
        try {
            const { contractSupportId } = req.params;
            const { userId } = req.body;
            const actorUserId = req.user?.id || null;
            const updated = await this.service.assignResponsible(contractSupportId, userId, actorUserId);
            return res.status(200).json(Response.success('Responsable asignado', updated));
        } catch (err) { next(err); }
    };

    // POST /supports/:contractSupportId/upload
    uploadEvidence = async (req, res, next) => {
        try {
            const { contractSupportId } = req.params;
            // expected body: { uploaderUserContractRoleId, file_hash, file_name, mime_type, size_bytes, azure_container, azure_blob_path, azure_etag, azure_version_id, secop_status, sia_status, comment }
            const payload = req.body;
            const creatorUserId = req.user?.id || payload.created_by || null;
            const upload = await this.service.uploadEvidence(contractSupportId, payload.uploaderUserContractRoleId, creatorUserId, payload);
            return res.status(201).json(Response.success('Upload metadata registrada', upload, 201));
        } catch (err) { next(err); }
    };

    // GET /supports/:contractSupportId/uploads
    getUploads = async (req, res, next) => {
        try {
            const { contractSupportId } = req.params;
            const uploads = await this.service.getUploads(contractSupportId);
            return res.status(200).json(Response.success('Uploads obtenidos', uploads));
        } catch (err) { next(err); }
    };

    // GET /supports/:contractSupportId/history
    getHistory = async (req, res, next) => {
        try {
            const { contractSupportId } = req.params;
            const history = await this.service.getHistory(contractSupportId);
            return res.status(200).json(Response.success('History', history));
        } catch (err) { next(err); }
    };

    // PATCH /supports/:contractSupportId/status
    updateSupportStatus = async (req, res, next) => {
        try {
            const { contractSupportId } = req.params;
            const { status } = req.body;
            const actorId = req.user?.id || null;
            const updated = await this.service.updateContractSupportStatus(contractSupportId, status, actorId);
            return res.status(200).json(Response.success('Status actualizado', updated));
        } catch (err) { next(err); }
    };

    // PATCH /uploads/:uploadId/portal-status
    updateUploadPortalStatus = async (req, res, next) => {
        try {
            const { uploadId } = req.params;
            const { secop_status, sia_status } = req.body;
            const actorId = req.user?.id || null;
            const updated = await this.service.updateUploadPortalStatus(uploadId, { secop_status, sia_status }, actorId);
            return res.status(200).json(Response.success('Portal status actualizado', updated));
        } catch (err) { next(err); }
    };
}

module.exports = SupportController;
