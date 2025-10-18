import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class Company extends Model {}

  Company.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      tax_id: { type: DataTypes.STRING },
    },
    { sequelize, modelName: "Company", tableName: "companies", timestamps: true }
  );

  return Company;
};
