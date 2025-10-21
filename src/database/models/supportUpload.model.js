const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class SupportUpload extends Model {
    static associate(models) {
      SupportUpload.belongsTo(models.ContractSupport, {
        foreignKey: 'contractSupportId',
        as: 'contractSupport',
      });

      SupportUpload.belongsTo(models.UserContractRole, {
        foreignKey: 'usersContractId',
        as: 'uploader',
      });

      SupportUpload.belongsTo(models.User, {
        foreignKey: 'createdBy',
        as: 'creator',
      });

      SupportUpload.hasMany(models.SupportHistory, {
        foreignKey: 'supportUploadId',
        as: 'history',
      });
    }
  }

  SupportUpload.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

      contractSupportId: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        comment: 'Referencia al soporte que define qué documento se debe cargar'
      },

      usersContractId: { 
        type: DataTypes.INTEGER, 
        allowNull: true, 
        comment: 'Usuario asignado al contrato que realiza la carga'
      },

      file_hash: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        comment: 'Hash único del archivo cargado para evitar duplicidad'
      },

      file_name: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        comment: 'Nombre original del archivo cargado'
      },

      uploaded_at: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW 
      },

      status: { 
        type: DataTypes.ENUM('pending', 'approved', 'rejected'), 
        defaultValue: 'pending' 
      },

      comment: { 
        type: DataTypes.TEXT, 
        allowNull: true, 
        comment: 'Comentario o nota del aprobador'
      },

      createdBy: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        comment: 'Usuario que registró la carga inicial'
      },
    },
    {
      sequelize,
      modelName: 'SupportUpload',
      tableName: 'support_uploads',
      timestamps: true,
      paranoid: true,
      underscored: true,
    }
  );

  return SupportUpload;
};
