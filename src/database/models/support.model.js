const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Support extends Model {
    static associate(models) {
      Support.belongsToMany(models.Resolution, {
        through: models.ResolutionSupport,
        foreignKey: 'supportId',
        as: 'resolutions'
      });

      Support.hasMany(models.ContractSupport, { foreignKey: 'supportId', as: 'contractSupports' });
    }
  }

  Support.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      support_name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT },
      delivery_term: { type: DataTypes.INTEGER },
    },
    { sequelize, modelName: 'Support', tableName: 'supports', timestamps: true }
  );

  return Support;
};
