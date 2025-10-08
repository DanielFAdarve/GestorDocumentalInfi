const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserContract = sequelize.define("UserContract", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  contractId: { type: DataTypes.INTEGER, allowNull: false },
  roleId: { type: DataTypes.INTEGER, allowNull: false },
}, {
  tableName: "users_contracts",
  timestamps: false,
});

module.exports = UserContract;