const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ContractSupport extends Model {
    static associate(models) {
      ContractSupport.belongsTo(models.Contract, { foreignKey: 'contractId', as: 'contract' });
      ContractSupport.belongsTo(models.Support, { foreignKey: 'supportId', as: 'support' });
      ContractSupport.belongsTo(models.User, { foreignKey: 'userId', as: 'responsible' });

      ContractSupport.hasMany(models.SupportHistory, {
        foreignKey: 'contractSupportId',
        as: 'history'
      });
    }
  }

  ContractSupport.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      contractId: { type: DataTypes.INTEGER, allowNull: false },
      supportId: { type: DataTypes.INTEGER, allowNull: false },
      userId: { type: DataTypes.INTEGER },
      status: { type: DataTypes.STRING, defaultValue: 'pending' },
      file_hash: { type: DataTypes.STRING },
    },
    { sequelize, modelName: 'ContractSupport', tableName: 'contract_supports', timestamps: true }
  );

  return ContractSupport;
};
