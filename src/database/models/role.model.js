const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Role extends Model {
    static associate(models) {
      Role.hasMany(models.UserCompanyRole, { foreignKey: 'roleId' });
      Role.hasMany(models.UserContractRole, { foreignKey: 'roleId' });
    }
  }

  Role.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT },
    },
    { sequelize, modelName: 'Role', tableName: 'roles', timestamps: true }
  );

  return Role;
};
