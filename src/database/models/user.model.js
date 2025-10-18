const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  class User extends Model {
    // 🔐 Compara contraseñas
    async validatePassword(password) {
      return bcrypt.compare(password, this.password);
    }

    // 🚫 Oculta campos sensibles al devolver el usuario
    toJSON() {
      const values = { ...this.get() };
      delete values.password;
      return values;
    }

    static associate(models) {
      // Relaciones N:N
      User.belongsToMany(models.Company, {
        through: models.UserCompanyRole,
        foreignKey: 'userId',
        as: 'companies',
      });

      User.belongsToMany(models.Contract, {
        through: models.UserContractRole,
        foreignKey: 'userId',
        as: 'contracts',
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
      area: {
        type: DataTypes.ENUM('administrativa', 'técnica', 'financiera', 'contable', 'legal', 'otra'),
        allowNull: false,
        defaultValue: 'otra',
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: true,
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed('password')) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
      },
    }
  );

  return User;
};
