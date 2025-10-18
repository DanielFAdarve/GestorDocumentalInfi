const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Contract extends Model {
    static associate(models) {
      Contract.belongsTo(models.Company, { foreignKey: 'companyId', as: 'company' });
      Contract.belongsTo(models.Resolution, { foreignKey: 'resolutionId', as: 'resolution' });

      Contract.belongsToMany(models.User, {
        through: models.UserContractRole,
        foreignKey: 'contractId',
        as: 'users'
      });

      Contract.hasMany(models.ContractSupport, { foreignKey: 'contractId', as: 'supports' });
    }
  }

  Contract.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      contract_number: { type: DataTypes.STRING, allowNull: false },
      start_date: { type: DataTypes.DATE, allowNull: false },
    },
    { sequelize, modelName: 'Contract', tableName: 'contracts', timestamps: true }
  );

  return Contract;
};
