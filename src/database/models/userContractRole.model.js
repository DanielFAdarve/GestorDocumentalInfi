const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class UserContractRole extends Model {
    static associate(models) {
      UserContractRole.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      UserContractRole.belongsTo(models.Contract, { foreignKey: 'contract_id', as: 'contract' });
      UserContractRole.belongsTo(models.Role, { foreignKey: 'role_id', as: 'role' });
    }
  }

  UserContractRole.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    contract_id: { type: DataTypes.INTEGER, allowNull: false },
    role_id: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    sequelize, modelName: 'UserContractRole', tableName: 'user_contract_roles', timestamps: true, underscored: true,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['contract_id'] },
      { unique: true, fields: ['user_id','contract_id','role_id'] }
    ]
  });

  return UserContractRole;
};
