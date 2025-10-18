import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class Contract extends Model {}

  Contract.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      contract_number: { type: DataTypes.STRING, allowNull: false },
      start_date: { type: DataTypes.DATE, allowNull: false },
    },
    { sequelize, modelName: "Contract", tableName: "contracts", timestamps: true }
  );

  return Contract;
};