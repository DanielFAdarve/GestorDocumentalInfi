const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      // Relaciones N:N
      User.belongsToMany(models.Company, {
        through: models.UserCompanyRole,
        foreignKey: 'userId',
        as: 'companies'
      });

      User.belongsToMany(models.Contract, {
        through: models.UserContractRole,
        foreignKey: 'userId',
        as: 'contracts'
      });

      // Relaciones directas
      User.hasMany(models.ContractSupport, { foreignKey: 'userId', as: 'assignedSupports' });
      User.hasMany(models.SupportHistory, { foreignKey: 'userId', as: 'supportHistory' });
    }
  }

  User.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      user_type: { type: DataTypes.STRING },
      active: { type: DataTypes.BOOLEAN, defaultValue: true },
      area: { type: DataTypes.STRING },
    },
    { sequelize, modelName: 'User', tableName: 'users', timestamps: true }
  );

  return User;
};
