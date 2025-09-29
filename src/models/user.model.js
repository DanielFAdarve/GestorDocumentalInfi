const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  user_type: { 
    type: DataTypes.ENUM("admin", "normal"), 
    defaultValue: "normal" 
  }
}, {
  tableName: "users",
  timestamps: false
});

module.exports = User;
