const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class SupportUpload extends Model {
    static associate(models) {
      SupportUpload.belongsTo(models.ContractSupport, { foreignKey: 'contract_support_id', as: 'contractSupport' });
      SupportUpload.belongsTo(models.UserContractRole, { foreignKey: 'users_contract_role_id', as: 'uploaderRole' });
      SupportUpload.belongsTo(models.User, { foreignKey: 'created_by', as: 'creator' });

      SupportUpload.hasMany(models.SupportHistory, { foreignKey: 'support_upload_id', as: 'history' });
    }
  }

  SupportUpload.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    contract_support_id: { type: DataTypes.INTEGER, allowNull: false },
    users_contract_role_id: { type: DataTypes.INTEGER, allowNull: true },
    created_by: { type: DataTypes.INTEGER, allowNull: false },

    // file metadata and storage
    file_hash: { type: DataTypes.STRING, allowNull: false, comment: 'sha256 hash for dedupe' },
    file_name: { type: DataTypes.STRING, allowNull: false },
    mime_type: { type: DataTypes.STRING, allowNull: true },
    size_bytes: { type: DataTypes.BIGINT, allowNull: true },

    // azure metadata
    azure_container: { type: DataTypes.STRING, allowNull: false },
    azure_blob_path: { type: DataTypes.STRING, allowNull: false },
    azure_etag: { type: DataTypes.STRING, allowNull: true },
    azure_version_id: { type: DataTypes.STRING, allowNull: true },

    uploaded_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },

    // status local
    status: { type: DataTypes.ENUM('pending','approved','rejected'), defaultValue: 'pending' },

    // portal statuses
    secop_status: {
      type: DataTypes.ENUM('Pendiente','Pendiente_Carga_Automatica','Cargado_Manual','Cargado_Automatico'),
      allowNull: false,
      defaultValue: 'Pendiente'
    },
    sia_status: {
      type: DataTypes.ENUM('Pendiente','Pendiente_Carga_Automatica','Cargado_Manual','Cargado_Automatico'),
      allowNull: false,
      defaultValue: 'Pendiente'
    },

    comment: { type: DataTypes.TEXT, allowNull: true }
  }, {
    sequelize, modelName: 'SupportUpload', tableName: 'support_uploads', timestamps: true, paranoid: true, underscored: true,
    indexes: [
      { fields: ['contract_support_id'] },
      { fields: ['created_by'] },
      { unique: true, fields: ['file_hash'] }, // enforce uniqueness to avoid dup uploads
      { fields: ['secop_status'] },
      { fields: ['sia_status'] }
    ]
  });

  return SupportUpload;
};
