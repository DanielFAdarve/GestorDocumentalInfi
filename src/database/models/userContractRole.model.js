const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class UserContractRole extends Model {}

  UserContractRole.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      contractId: { type: DataTypes.INTEGER, allowNull: false },
      roleId: { type: DataTypes.INTEGER },
    },
    { sequelize, modelName: 'UserContractRole', tableName: 'user_contract_roles', timestamps: true }
  );

  return UserContractRole;
};
