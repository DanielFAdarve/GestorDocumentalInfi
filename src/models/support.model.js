const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Support = sequelize.define("Support", {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  support_name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING },
  delivery_term: { type: DataTypes.BIGINT }
}, {
  tableName: "supports",
  timestamps: false
});

module.exports = Support;
