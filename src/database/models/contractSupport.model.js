const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ContractSupport extends Model {
    static associate(models) {
      ContractSupport.belongsTo(models.Contract, { foreignKey: 'contract_id', as: 'contract' });
      ContractSupport.belongsTo(models.Support, { foreignKey: 'support_id', as: 'support' });
      ContractSupport.belongsTo(models.User, { foreignKey: 'responsible_user_id', as: 'responsible' });

      ContractSupport.hasMany(models.SupportUpload, { foreignKey: 'contract_support_id', as: 'uploads' });
      ContractSupport.hasMany(models.SupportHistory, { foreignKey: 'contract_support_id', as: 'history' });
    }
  }

  ContractSupport.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    contract_id: { type: DataTypes.INTEGER, allowNull: false },
    support_id: { type: DataTypes.INTEGER, allowNull: false },
    // responsible user for this support (must be assigned user of the contract)
    responsible_user_id: { type: DataTypes.INTEGER, allowNull: true },

    // stage for which this support applies; duplicated from support mapping but helps queries
    stage: { type: DataTypes.ENUM('pre_contractual','contractual'), allowNull: false },

    // required, order and override terms
    is_required: { type: DataTypes.BOOLEAN, defaultValue: true },
    order: { type: DataTypes.INTEGER, defaultValue: 0 },
    due_date: { type: DataTypes.DATE, allowNull: true },
    delivery_limit_days: { type: DataTypes.INTEGER, allowNull: true },

    // overall status of this requirement for the contract
    status: { type: DataTypes.ENUM('pending','uploaded','approved','rejected','overdue'), defaultValue: 'pending' },

    file_hash: { type: DataTypes.STRING, allowNull: true }, // convenience: last approved file hash

    createdBy: { type: DataTypes.INTEGER, allowNull: true },
    updatedBy: { type: DataTypes.INTEGER, allowNull: true }
  }, {
    sequelize, modelName: 'ContractSupport', tableName: 'contract_supports', timestamps: true, underscored: true,
    indexes: [
      { fields: ['contract_id'] },
      { fields: ['support_id'] },
      { fields: ['responsible_user_id'] }
    ]
  });

  return ContractSupport;
};
