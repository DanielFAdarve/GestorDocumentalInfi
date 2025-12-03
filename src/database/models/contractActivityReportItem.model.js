const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ContractActivityReportItem extends Model {
    static associate(models) {
      ContractActivityReportItem.belongsTo(models.ContractActivityReport, {
        foreignKey: 'report_id',
        as: 'report'
      });
    }
  }

  ContractActivityReportItem.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    report_id: { type: DataTypes.INTEGER, allowNull: false },

    obligation_text: { type: DataTypes.TEXT, allowNull: false },
    activity_text: { type: DataTypes.TEXT, allowNull: false }

  }, {
    sequelize,
    modelName: 'ContractActivityReportItem',
    tableName: 'contract_activity_report_items',
    timestamps: true,
    underscored: true
  });

  return ContractActivityReportItem;
};
