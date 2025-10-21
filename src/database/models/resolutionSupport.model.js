const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ResolutionSupport extends Model {}

  ResolutionSupport.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      resolutionId: { type: DataTypes.INTEGER, allowNull: false },
      supportId: { type: DataTypes.INTEGER, allowNull: false },
    },
    { sequelize, modelName: 'ResolutionSupport', tableName: 'resolution_supports', timestamps: false }
  );

  return ResolutionSupport;
};
