const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Resolution extends Model {
    static associate(models) {
      Resolution.belongsToMany(models.Support, {
        through: models.ResolutionSupport,
        foreignKey: 'resolutionId',
        as: 'supports'
      });

      Resolution.hasMany(models.Contract, { foreignKey: 'resolutionId', as: 'contracts' });
    }
  }

  Resolution.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      resolution_name: { type: DataTypes.STRING, allowNull: false },
    },
    { sequelize, modelName: 'Resolution', tableName: 'resolutions', timestamps: true }
  );

  return Resolution;
};
