const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Permission = sequelize.define("Permission", {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  permission_name: { type: DataTypes.STRING, allowNull: false }
}, {
  tableName: "permissions",
  timestamps: false
});

module.exports = Permission;
