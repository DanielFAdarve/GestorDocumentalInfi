const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ContractObligation extends Model {
    static associate(models) {
      ContractObligation.belongsTo(models.Contract, {
        foreignKey: 'contract_id',
        as: 'contract'
      });

      ContractObligation.hasMany(models.ContractObligationPeriod, {
        foreignKey: 'obligation_id',
        as: 'periods'
      });
    }
  }

  ContractObligation.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    contract_id: { type: DataTypes.INTEGER, allowNull: false },

    description: { type: DataTypes.TEXT, allowNull: false },

    type: {
      type: DataTypes.ENUM('única','recurrente','eventual'),
      allowNull: false
    },

    recurrence: {
      type: DataTypes.ENUM('ninguna','mensual','trimestral','semestral','anual'),
      allowNull: false,
      defaultValue: 'ninguna'
    },

    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER

  }, {
    sequelize,
    modelName: 'ContractObligation',
    tableName: 'contract_obligations',
    timestamps: true,
    underscored: true
  });

  return ContractObligation;
};
