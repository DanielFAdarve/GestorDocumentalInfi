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

    responsible_user_id: { type: DataTypes.INTEGER, allowNull: true },
    stage: { type: DataTypes.ENUM('pre_contractual','contractual'), allowNull: false },

    is_required: { type: DataTypes.BOOLEAN, defaultValue: true },
    order: { type: DataTypes.INTEGER, defaultValue: 0 },

    due_date: { type: DataTypes.DATE, allowNull: true },
    delivery_limit_days: { type: DataTypes.INTEGER, allowNull: true },

    status: { type: DataTypes.ENUM('pending','uploaded','approved','rejected','overdue'), defaultValue: 'pending' },
    file_hash: { type: DataTypes.STRING, allowNull: true },

    // NUEVO → compatibilidad total con la matriz
    periodicity: { type: DataTypes.ENUM('unico','mensual','anual','semestral','otro'), allowNull: true },
    expires_at: { type: DataTypes.DATE, allowNull: true },

    createdBy: { type: DataTypes.INTEGER, allowNull: true },
    updatedBy: { type: DataTypes.INTEGER, allowNull: true }

  }, {
    sequelize,
    modelName: 'ContractSupport',
    tableName: 'contract_supports',
    timestamps: true,
    underscored: true
  });

  return ContractSupport;
};
