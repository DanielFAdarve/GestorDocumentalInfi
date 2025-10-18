// usersCompany.model.js
import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class UsersCompanies extends Model {}

  UsersCompanies.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    },
    { sequelize, modelName: "UsersCompanies", tableName: "users_companies", timestamps: true }
  );

  return UsersCompanies;
};
