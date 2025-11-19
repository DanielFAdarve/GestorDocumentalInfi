const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Contract extends Model {
    static associate(models) {
      Contract.belongsTo(models.Company, { foreignKey: 'company_id', as: 'company' });
      Contract.belongsTo(models.ContractType, { foreignKey: 'contract_type_id', as: 'contractType' });
      // many-to-many users
      Contract.belongsToMany(models.User, {
        through: models.UserContractRole,
        foreignKey: 'contract_id',
        as: 'users'
      });

      Contract.hasMany(models.ContractSupport, { foreignKey: 'contract_id', as: 'supports' });
    }
  }

  Contract.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    company_id: { type: DataTypes.INTEGER, allowNull: false },
    contract_number: { type: DataTypes.STRING, allowNull: false },
    contract_type_id: { type: DataTypes.INTEGER, allowNull: false },
    contract_object: { type: DataTypes.TEXT, allowNull: false },
    contractor_user_id: { type: DataTypes.INTEGER, allowNull: true },
    dependency: {
      type: DataTypes.ENUM('TIC','Corporativos','Proyectos','Bienes','Planeación','Otra'),
      allowNull: false, defaultValue: 'Otra'
    },
    estimated_value: { type: DataTypes.DECIMAL(15,2), allowNull: true },
    start_date: { type: DataTypes.DATE, allowNull: true },
    end_date: { type: DataTypes.DATE, allowNull: true },
    sign_date: { type: DataTypes.DATE, allowNull: true },
    stage: { type: DataTypes.ENUM('pre_contractual','contractual'), allowNull: false, defaultValue: 'pre_contractual' },

    // contract business status
    status: {
      type: DataTypes.ENUM('Activo','Finalizado_Completo','Finalizado_Previo'),
      allowNull: false, defaultValue: 'Activo'
    },

    // sync statuses for portal-level visibility for the contract entity
    status_secop: {
      type: DataTypes.ENUM('Pendiente_Creacion','Pendiente_Actualizacion','Actualizado'),
      allowNull: false, defaultValue: 'Pendiente_Creacion'
    },
    status_sia: {
      type: DataTypes.ENUM('Pendiente_Creacion','Pendiente_Actualizacion','Actualizado'),
      allowNull: false, defaultValue: 'Pendiente_Creacion'
    },

    comment: { type: DataTypes.TEXT, allowNull: true },

    createdBy: { type: DataTypes.INTEGER, allowNull: true },
    updatedBy: { type: DataTypes.INTEGER, allowNull: true }
  }, {
    sequelize, modelName: 'Contract', tableName: 'contracts', timestamps: true, underscored: true,
    indexes: [
      { fields: ['company_id'] },
      { fields: ['contract_number'] },
      { fields: ['contract_type_id'] }
    ]
  });

  return Contract;
};
