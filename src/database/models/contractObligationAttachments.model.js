const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ContractObligationAttachment extends Model {
    static associate(models) {
      ContractObligationAttachment.belongsTo(models.ContractObligationPeriod, {
        foreignKey: 'period_id',
        as: 'period'
      });
    }
  }

  ContractObligationAttachment.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    period_id: { type: DataTypes.INTEGER, allowNull: false },

    filename: { type: DataTypes.STRING, allowNull: false },
    azure_url: { type: DataTypes.STRING, allowNull: false },

    uploadedBy: DataTypes.INTEGER

  }, {
    sequelize,
    modelName: 'ContractObligationAttachment',
    tableName: 'contract_obligation_attachments',
    timestamps: true,
    underscored: true
  });

  return ContractObligationAttachment;
};
