const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ContractActivityReport extends Model {
    static associate(models) {
      ContractActivityReport.belongsTo(models.Contract, {
        foreignKey: 'contract_id',
        as: 'contract'
      });

      ContractActivityReport.hasMany(models.ContractActivityReportItem, {
        foreignKey: 'report_id',
        as: 'items'
      });
    }
  }

  ContractActivityReport.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    contract_id: { type: DataTypes.INTEGER, allowNull: false },

    report_number: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },

    activity_start: { type: DataTypes.DATEONLY, allowNull: false },
    activity_end: { type: DataTypes.DATEONLY, allowNull: false },

    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ContractActivityReport',
    tableName: 'contract_activity_reports',
    timestamps: true,
    underscored: true
  });

  return ContractActivityReport;
};
