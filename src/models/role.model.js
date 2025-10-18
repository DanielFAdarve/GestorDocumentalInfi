import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class Role extends Model {}

  Role.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.STRING },
    },
    { sequelize, modelName: "Role", tableName: "roles", timestamps: true }
  );

  return Role;
};
