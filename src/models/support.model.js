import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class Support extends Model {}

  Support.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      support_name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.STRING },
      delivery_term: { type: DataTypes.INTEGER },
    },
    { sequelize, modelName: "Support", tableName: "supports", timestamps: true }
  );

  return Support;
};