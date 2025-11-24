const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  class User extends Model {
    async validatePassword(password) { return bcrypt.compare(password, this.password); }
    toJSON() { const values = { ...this.get() }; delete values.password; return values; }

    static associate(models) {
      User.belongsToMany(models.Company, {
        through: models.UserCompanyRole,
        foreignKey: 'user_id',
        as: 'companies'
      });

      User.belongsToMany(models.Contract, {
        through: models.UserContractRole,
        foreignKey: 'user_id',
        as: 'contracts'
      });

      User.hasMany(models.ContractSupport, { foreignKey: 'responsible_user_id', as: 'responsibleSupports' });
      User.hasMany(models.SupportUpload, { foreignKey: 'created_by', as: 'uploads' });
      User.hasMany(models.SupportHistory, { foreignKey: 'actor_user_id', as: 'historyActs' });
    }
  }

  User.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    user_type: { type: DataTypes.STRING, allowNull: true },
    active: { type: DataTypes.BOOLEAN, defaultValue: true },
    area: {
      type: DataTypes.ENUM('administrativa','técnica','financiera','contable','legal','otra'),
      allowNull: false,
      defaultValue: 'otra'
    },
    createdBy: { type: DataTypes.INTEGER, allowNull: true },
    updatedBy: { type: DataTypes.INTEGER, allowNull: true },
  }, {
    sequelize, modelName: 'User', tableName: 'users', timestamps: true, underscored: true,
    hooks: {
      beforeCreate: async (user) => { if (user.password) user.password = await bcrypt.hash(user.password, 10); },
      beforeUpdate: async (user) => { if (user.changed('password')) user.password = await bcrypt.hash(user.password, 10); }
    },
    indexes: [
      { fields: ['email'] },
      { fields: ['active'] }
    ]
  });

  return User;
};
