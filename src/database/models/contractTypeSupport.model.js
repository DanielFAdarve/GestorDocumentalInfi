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

    stage: { type: DataTypes.ENUM('pre_contractual','contractual'), allowNull: false },

    // NUEVOS
    is_required: { type: DataTypes.BOOLEAN, defaultValue: true },
    order: { type: DataTypes.INTEGER, defaultValue: 0 },

    // validación de vigencias según matriz
    max_days_old: { type: DataTypes.INTEGER, allowNull: true }, // ejemplo: "no mayor a 30 días"
    enforce_expiration: { type: DataTypes.BOOLEAN, defaultValue: false }, // si debe controlar vencimiento
    expiration_days: { type: DataTypes.INTEGER, allowNull: true }, // válido si enforce_expiration = true

  }, {
    sequelize,
    modelName: 'ContractTypeSupport',
    tableName: 'contract_type_supports',
    timestamps: false,
    underscored: true,
    indexes: [
      { fields: ['contract_type_id'] },
      { fields: ['support_id'] }
    ]
  });

  return ContractTypeSupport;
};
