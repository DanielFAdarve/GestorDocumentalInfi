const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserCompany = sequelize.define("UserCompany", {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.BIGINT, allowNull: false },
  companyId: { type: DataTypes.BIGINT, allowNull: false },
  area: {
    type: DataTypes.ENUM(
      "administrativa",
      "técnica",
      "financiera",
      "contable",
      "legal",
      "no_determinada"
    ),
    allowNull: false,
    defaultValue: "no_determinada"
  }
}, {
  tableName: "users_companies",
  timestamps: false
});

module.exports = UserCompany;