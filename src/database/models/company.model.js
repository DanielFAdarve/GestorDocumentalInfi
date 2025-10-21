const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Company extends Model {
    static associate(models) {
      Company.belongsToMany(models.User, {
        through: models.UserCompanyRole,
        foreignKey: 'companyId',
        as: 'users'
      });

      Company.hasMany(models.Contract, {
        foreignKey: 'companyId',
        as: 'contracts'
      });
    }
  }

  Company.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      tax_id: { type: DataTypes.STRING },
      active: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    { sequelize, modelName: 'Company', tableName: 'companies', timestamps: true }
  );

  return Company;
};
