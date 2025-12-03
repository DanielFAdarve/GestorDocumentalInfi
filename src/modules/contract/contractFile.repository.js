class FileRepository {
  constructor(models) {
    this.File = models.File;
    this.Attachment = models.Attachment;
  }

  // Crea un archivo + metadata del attachment
  async createWithAttachment(fileData, attachmentData, tx) {
    const file = await this.File.create(fileData, { transaction: tx });

    await this.Attachment.create(
      {
        fileId: file.id,
        contractId: fileData.contractId,
        nombre_original: attachmentData.nombre_original,
        tipo_archivo: attachmentData.tipo_archivo,
        size: attachmentData.size,
        extension: attachmentData.extension,
        ruta: attachmentData.ruta,
      },
      { transaction: tx }
    );

    return file;
  }

  // Crear archivos en lote
  async bulkCreate(files, tx) {
    for (const file of files) {
      const { attachment, ...fileData } = file;
      await this.createWithAttachment(fileData, attachment, tx);
    }
  }

  async findByContractId(contractId) {
    return this.File.findAll({
      where: { contractId },
      include: [{ model: this.Attachment, as: 'attachment' }],
    });
  }

  // Borrar archivos + attachments
  async deleteByContract(contractId, tx) {
    const files = await this.File.findAll({
      where: { contractId },
      transaction: tx
    });

    const ids = files.map(f => f.id);

    if (ids.length) {
      await this.Attachment.destroy({
        where: { fileId: ids },
        transaction: tx
      });

      await this.File.destroy({
        where: { id: ids },
        transaction: tx
      });
    }
  }
}

module.exports = FileRepository;
