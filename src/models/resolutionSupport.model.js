import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class ResolutionSupport extends Model {}

  ResolutionSupport.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    },
    { sequelize, modelName: "ResolutionSupport", tableName: "resolution_supports", timestamps: false }
  );

  return ResolutionSupport;
};