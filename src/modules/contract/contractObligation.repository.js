class ObligationRepository {
  constructor(models) {
    this.Obligation = models.Obligation;
    this.ObligationPeriod = models.ObligationPeriod;
  }

  // Crear obligación con periodos
  async createWithPeriods(obligationData, periods, tx) {
    const obligation = await this.Obligation.create(obligationData, { transaction: tx });

    if (periods && periods.length > 0) {
      const mappedPeriods = periods.map(p => ({
        obligationId: obligation.id,
        periodo: p.periodo,
        fecha_inicio: p.fecha_inicio,
        fecha_fin: p.fecha_fin
      }));

      await this.ObligationPeriod.bulkCreate(mappedPeriods, {
        transaction: tx,
      });
    }

    return obligation;
  }

  // Crear varias obligaciones (cada una con periodos)
  async bulkCreate(obligations, tx) {
    for (const ob of obligations) {
      const { periods, ...obligationData } = ob;
      await this.createWithPeriods(obligationData, periods, tx);
    }
  }

  async findByContractId(contractId) {
    return this.Obligation.findAll({
      where: { contractId },
      include: [{ model: this.ObligationPeriod, as: 'periods' }],
    });
  }

  // Borra obligaciones + periodos por contractId
  async deleteByContract(contractId, tx) {
    const obligations = await this.Obligation.findAll({
      where: { contractId },
      transaction: tx
    });

    const ids = obligations.map(o => o.id);

    if (ids.length) {
      await this.ObligationPeriod.destroy({
        where: { obligationId: ids },
        transaction: tx
      });

      await this.Obligation.destroy({
        where: { id: ids },
        transaction: tx
      });
    }
  }
}

module.exports = ObligationRepository;
