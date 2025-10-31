const AppError = require('../../core/errors/AppError');

class EvidenceService {
  constructor(evidenceRepository) {
    this.evidenceRepository = evidenceRepository;
  }

  async getPendingEvidences(contractId) {
    if (!contractId) throw new AppError('El ID del contrato es obligatorio', 400);

    const evidences = await this.evidenceRepository.findPendingByContract(contractId);

    // Transformación al formato esperado por el frontend
    return evidences.map((ev) => ({
      obligationId: ev.contractSupport?.support?.id ?? null,
      uploadedBy: ev.creator?.name ?? 'Desconocido',
      uploadedAt: ev.uploaded_at,
      fileName: ev.file_name,
      downloadUrl: ev.file_hash ? `/uploads/${ev.file_hash}` : null,
      approvalStatus: ev.status,
    }));
  }
}

module.exports = EvidenceService;
