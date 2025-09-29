const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Company = sequelize.define("Company", {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  tax_id: { type: DataTypes.BIGINT, allowNull: false, unique: true }
}, {
  tableName: "companies",
  timestamps: false
});

module.exports = Company;
