const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class AuditLog extends Model {}

  AuditLog.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: DataTypes.INTEGER, allowNull: true },
      userName: { type: DataTypes.STRING, allowNull: true },
      entity: { type: DataTypes.STRING, allowNull: false }, // módulo o tabla afectada
      action: { type: DataTypes.STRING, allowNull: false }, // create, update, delete
      method: { type: DataTypes.STRING, allowNull: true }, // método HTTP
      endpoint: { type: DataTypes.STRING, allowNull: true }, // ruta exacta
      oldValue: { type: DataTypes.TEXT, allowNull: true },
      newValue: { type: DataTypes.TEXT, allowNull: true },
      ipAddress: { type: DataTypes.STRING, allowNull: true },
      timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      sequelize,
      modelName: 'AuditLog',
      tableName: 'audit_logs',
      timestamps: false,
    }
  );

  return AuditLog;
};
