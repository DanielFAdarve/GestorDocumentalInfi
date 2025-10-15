const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const SupportHistory = sequelize.define("SupportHistory", {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },

  contractSupportId: { type: DataTypes.BIGINT, allowNull: false },
  userId: { type: DataTypes.BIGINT, allowNull: false },

  file_hash: { type: DataTypes.STRING, allowNull: false },
  comment: { type: DataTypes.TEXT, allowNull: true },
}, {
  tableName: "support_history",
  timestamps: true
});

module.exports = SupportHistory;
