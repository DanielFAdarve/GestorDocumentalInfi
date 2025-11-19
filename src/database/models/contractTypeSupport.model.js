const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ContractTypeSupport extends Model {
    static associate(models) {
      ContractTypeSupport.belongsTo(models.ContractType, { foreignKey: 'contract_type_id', as: 'contractType' });
      ContractTypeSupport.belongsTo(models.Support, { foreignKey: 'support_id', as: 'support' });
    }
  }

  ContractTypeSupport.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    contract_type_id: { type: DataTypes.INTEGER, allowNull: false },
    support_id: { type: DataTypes.INTEGER, allowNull: false },
    // etapa: pre_contractual | contractual
    stage: { type: DataTypes.ENUM('pre_contractual','contractual'), allowNull: false },
    // si es obligatorio por defecto para este tipo
    is_required: { type: DataTypes.BOOLEAN, defaultValue: true },
    // orden de presentación/validación
    order: { type: DataTypes.INTEGER, defaultValue: 0 }
  }, {
    sequelize, modelName: 'ContractTypeSupport', tableName: 'contract_type_supports', timestamps: false, underscored: true,
    indexes: [
      { fields: ['contract_type_id'] },
      { fields: ['support_id'] }
    ]
  });

  return ContractTypeSupport;
};
