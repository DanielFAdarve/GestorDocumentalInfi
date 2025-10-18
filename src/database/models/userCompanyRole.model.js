const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class UserCompanyRole extends Model {}

  UserCompanyRole.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      companyId: { type: DataTypes.INTEGER, allowNull: false },
      roleId: { type: DataTypes.INTEGER },
    },
    { sequelize, modelName: 'UserCompanyRole', tableName: 'user_company_roles', timestamps: true }
  );

  return UserCompanyRole;
};
