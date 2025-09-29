const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserCompany = sequelize.define("UserCompany", {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true }
}, {
  tableName: "users_companies",
  timestamps: false
});

module.exports = UserCompany;
