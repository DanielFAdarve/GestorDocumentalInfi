class ReportsRepository {
  constructor(models, sequelize) {
    this.models = models;
    this.sequelize = sequelize;
  }

  async findContractWithSupports(contractNumber) {
    console.log('🔍 Buscando contrato:', contractNumber);

    const contract = await this.models.Contract.findOne({
      where: this.sequelize.where(
        this.sequelize.fn('TRIM', this.sequelize.col('contract_number')),
        contractNumber.trim()
      ),
      include: [
        {
          model: this.models.ContractSupport,
          as: 'supports',
          attributes: [
            'id',
            'supportId',
            'userId',
            'status',
            'file_hash',
            'createdAt',
            'updatedAt'
          ],
        },
      ],
    });

    console.log('Resultado contrato:', contract ? contract.toJSON() : 'NO ENCONTRADO');
    return contract;
  }

  // 🔹 Nuevo método
  async findContractsByDependency(dependency) {
    console.log(`📂 Buscando todos los contratos con dependencia: ${dependency}`);

    const contracts = await this.models.Contract.findAll({
      where: { dependency },
      include: [
        {
          model: this.models.ContractSupport,
          as: 'supports',
          attributes: [
            'id',
            'supportId',
            'userId',
            'status',
            'file_hash',
            'createdAt',
            'updatedAt'
          ],
        },
      ],
    });

    console.log(`Encontrados ${contracts.length} contratos con dependencia ${dependency}`);
    return contracts;
  }
}

module.exports = ReportsRepository;
