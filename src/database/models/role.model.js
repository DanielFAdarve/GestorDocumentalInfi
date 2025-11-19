const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Role extends Model {
    static associate(models) {
      Role.hasMany(models.UserCompanyRole, { foreignKey: 'role_id' });
      Role.hasMany(models.UserContractRole, { foreignKey: 'role_id' });
    }
  }

  Role.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true }
  }, {
    sequelize, modelName: 'Role', tableName: 'roles', timestamps: true, underscored: true,
    indexes: [{ fields: ['name'] }]
  });

  return Role;
};
