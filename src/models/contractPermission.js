const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ContractPermission = sequelize.define("ContractPermission", {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true }
}, {
  tableName: "contracts_permissions",
  timestamps: false
});

module.exports = ContractPermission;
