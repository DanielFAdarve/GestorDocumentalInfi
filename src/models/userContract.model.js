const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserContract = sequelize.define("UserContract", {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true }
}, {
  tableName: "users_contracts",
  timestamps: false
});

module.exports = UserContract;
