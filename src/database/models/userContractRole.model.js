// models/userContractRole.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class UserContractRole extends Model {
    static associate(models) {
      UserContractRole.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      UserContractRole.belongsTo(models.Contract, { foreignKey: 'contractId', as: 'contract' });
      UserContractRole.belongsTo(models.Role, { foreignKey: 'roleId', as: 'role' });
    }
  }

  UserContractRole.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      contractId: { type: DataTypes.INTEGER, allowNull: false },
      roleId: { type: DataTypes.INTEGER, allowNull: false },
    },
    { sequelize, modelName: 'UserContractRole', tableName: 'user_contract_roles', timestamps: true }
  );

  return UserContractRole;
};
