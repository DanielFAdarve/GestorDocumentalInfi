const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Contract extends Model {
    static associate(models) {
      Contract.belongsTo(models.Company, { foreignKey: 'companyId', as: 'company' });
      Contract.belongsTo(models.Resolution, { foreignKey: 'resolutionId', as: 'resolution' });

      // Usuario contratista y roles asociados
      Contract.belongsToMany(models.User, {
        through: models.UserContractRole,
        foreignKey: 'contractId',
        as: 'users',
      });

      // Soportes del contrato
      Contract.hasMany(models.ContractSupport, { foreignKey: 'contractId', as: 'supports' });
    }
  }

  Contract.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      companyId: { type: DataTypes.INTEGER, allowNull: false },
      contract_number: { type: DataTypes.STRING, allowNull: false },
      contract_type: { type: DataTypes.STRING, allowNull: false },
      contract_object: { type: DataTypes.TEXT, allowNull: false },
      userId: { type: DataTypes.INTEGER, allowNull: false }, // Usuario contratista
      dependency: {
        type: DataTypes.ENUM(
          'TIC',
          'Corporativos',
          'Proyectos',
          'Bienes',
          'Planeación',
          'Otra'
        ),
        allowNull: false,
        defaultValue: 'Otra',
      },
      estimated_value: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
      start_date: { type: DataTypes.DATE, allowNull: false },
      end_date: { type: DataTypes.DATE, allowNull: false },
      sign_date: { type: DataTypes.DATE, allowNull: true },
      status: {
        type: DataTypes.ENUM('Activo', 'Finalizado_Completo', 'Finalizado_Previo'),
        allowNull: false,
        defaultValue: 'Activo',
      },
      comment: { type: DataTypes.TEXT, allowNull: true },
      resolutionId: { type: DataTypes.INTEGER, allowNull: true },
      responsibilities: { type: DataTypes.TEXT, allowNull: true },
      future_validity: { type: DataTypes.BOOLEAN, allowNull: true },
      liquidation: { type: DataTypes.BOOLEAN, allowNull: true },
      enviromental_obligations: { type: DataTypes.BOOLEAN, allowNull: true },
      consumption_obligations: { type: DataTypes.BOOLEAN, allowNull: true },
      reservation: { type: DataTypes.BOOLEAN, allowNull: true },
      secop_contract: { type: DataTypes.TEXT, allowNull: true },
      status_secop: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      sequelize,
      modelName: 'Contract',
      tableName: 'contracts',
      timestamps: true,
    }
  );

  return Contract;
};
