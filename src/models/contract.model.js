const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Contract = sequelize.define("Contract", {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  contract_number: { type: DataTypes.STRING, allowNull: false },
  start_date: { type: DataTypes.DATE, allowNull: false }
}, {
  tableName: "contracts",
  timestamps: false
});

module.exports = Contract;
