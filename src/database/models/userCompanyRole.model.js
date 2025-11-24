const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class UserCompanyRole extends Model {
    static associate(models) {
      UserCompanyRole.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      UserCompanyRole.belongsTo(models.Company, { foreignKey: 'company_id', as: 'company' });
      UserCompanyRole.belongsTo(models.Role, { foreignKey: 'role_id', as: 'role' });
    }
  }

  UserCompanyRole.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    company_id: { type: DataTypes.INTEGER, allowNull: false },
    role_id: { type: DataTypes.INTEGER, allowNull: true }
  }, {
    sequelize, modelName: 'UserCompanyRole', tableName: 'user_company_roles', timestamps: true, underscored: true,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['company_id'] },
      { unique: true, fields: ['user_id','company_id'] }
    ]
  });

  return UserCompanyRole;
};
