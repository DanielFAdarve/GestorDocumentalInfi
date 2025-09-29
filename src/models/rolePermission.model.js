const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const RolePermission = sequelize.define("RolePermission", {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true }
}, {
  tableName: "roles_permissions",
  timestamps: false
});

module.exports = RolePermission;
