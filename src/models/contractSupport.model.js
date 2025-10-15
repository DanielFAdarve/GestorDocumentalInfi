const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ContractSupport = sequelize.define("ContractSupport", {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },

  contractId: { type: DataTypes.BIGINT, allowNull: false },
  supportId: { type: DataTypes.BIGINT, allowNull: false },
  userId: { type: DataTypes.BIGINT, allowNull: true },

  status: {
    type: DataTypes.ENUM("pendiente", "aprobado", "rechazado"),
    defaultValue: "pendiente",
    allowNull: false
  },

  file_hash: { type: DataTypes.STRING, allowNull: true },
  comment: { type: DataTypes.TEXT, allowNull: true }
}, {
  tableName: "contract_supports",
  timestamps: true
});

module.exports = ContractSupport;
