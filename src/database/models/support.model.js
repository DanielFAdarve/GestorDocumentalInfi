const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Support extends Model {
    static associate(models) {
      Support.belongsToMany(models.ContractType, {
        through: models.ContractTypeSupport,
        foreignKey: 'support_id',
        as: 'contractTypes'
      });

      Support.hasMany(models.ContractSupport, { foreignKey: 'support_id', as: 'contractSupports' });
      Support.hasMany(models.SupportUpload, { foreignKey: 'support_id', as: 'uploads' });
    }
  }

  Support.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING, allowNull: true }, // optional code
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    // default delivery term in days for this support (can be overridden at contract level)
    delivery_term_days: { type: DataTypes.INTEGER, allowNull: true },
    // where the support may be uploaded (flags, defaults false)
    requires_secop: { type: DataTypes.BOOLEAN, defaultValue: false },
    requires_sia: { type: DataTypes.BOOLEAN, defaultValue: false },
  }, {
    sequelize, modelName: 'Support', tableName: 'supports', timestamps: true, underscored: true,
    indexes: [{ fields: ['name'] }]
  });

  return Support;
};
