const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Resolution = sequelize.define("Resolution", {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  resolution_name: { type: DataTypes.STRING, allowNull: false }
}, {
  tableName: "resolutions",
  timestamps: false
});

module.exports = Resolution;
