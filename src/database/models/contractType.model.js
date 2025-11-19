const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ContractType extends Model {
    static associate(models) {
      ContractType.hasMany(models.Contract, { foreignKey: 'contract_type_id', as: 'contracts' });
      ContractType.belongsToMany(models.Support, {
        through: models.ContractTypeSupport,
        foreignKey: 'contract_type_id',
        as: 'supports'
      });
    }
  }

  ContractType.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING, allowNull: false, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    active: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    sequelize, modelName: 'ContractType', tableName: 'contract_types', timestamps: true, underscored: true,
    indexes: [{ fields: ['code'] }, { fields: ['name'] }]
  });

  return ContractType;
};
