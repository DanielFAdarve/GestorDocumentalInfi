const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ContractObligationPeriod extends Model {
    static associate(models) {
      ContractObligationPeriod.belongsTo(models.ContractObligation, {
        foreignKey: 'obligation_id',
        as: 'obligation'
      });

      ContractObligationPeriod.hasMany(models.ContractObligationAttachment, {
        foreignKey: 'period_id',
        as: 'attachments'
      });
    }
  }

  ContractObligationPeriod.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    obligation_id: { type: DataTypes.INTEGER, allowNull: false },

    due_date: { type: DataTypes.DATEONLY, allowNull: false },
    delivered_at: { type: DataTypes.DATE },
    status: {
      type: DataTypes.ENUM('pending','delivered','late'),
      allowNull: false,
      defaultValue: 'pending'
    },

    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER

  }, {
    sequelize,
    modelName: 'ContractObligationPeriod',
    tableName: 'contract_obligation_periods',
    timestamps: true,
    underscored: true
  });

  return ContractObligationPeriod;
};
