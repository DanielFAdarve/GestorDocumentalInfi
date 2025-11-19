const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class SupportHistory extends Model {
    static associate(models) {
      SupportHistory.belongsTo(models.SupportUpload, { foreignKey: 'support_upload_id', as: 'upload' });
      SupportHistory.belongsTo(models.ContractSupport, { foreignKey: 'contract_support_id', as: 'contractSupport' });
      SupportHistory.belongsTo(models.User, { foreignKey: 'actor_user_id', as: 'actor' });
    }
  }

  SupportHistory.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    support_upload_id: { type: DataTypes.INTEGER, allowNull: true },
    contract_support_id: { type: DataTypes.INTEGER, allowNull: true },
    actor_user_id: { type: DataTypes.INTEGER, allowNull: true },

    event: { type: DataTypes.STRING, allowNull: false }, // 'upload','status_change','comment','auto_upload_attempt','assign_responsible'
    payload: { type: DataTypes.JSONB, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    sequelize, modelName: 'SupportHistory', tableName: 'support_history', timestamps: false, underscored: true,
    indexes: [{ fields: ['contract_support_id'] }, { fields: ['support_upload_id'] }]
  });

  return SupportHistory;
};
