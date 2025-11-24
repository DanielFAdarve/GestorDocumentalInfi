const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Company extends Model {
    static associate(models) {
      Company.belongsToMany(models.User, {
        through: models.UserCompanyRole,
        foreignKey: 'company_id',
        as: 'users',
      });

      Company.hasMany(models.Contract, { foreignKey: 'company_id', as: 'contracts' });
    }
  }

  Company.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    tax_id: { type: DataTypes.STRING, allowNull: true },
    active: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdBy: { type: DataTypes.INTEGER, allowNull: true },
    updatedBy: { type: DataTypes.INTEGER, allowNull: true },
  }, {
    sequelize, modelName: 'Company', tableName: 'companies', timestamps: true, underscored: true,
    indexes: [
      { fields: ['name'] },
      { fields: ['tax_id'] }
    ]
  });

  return Company;
};
