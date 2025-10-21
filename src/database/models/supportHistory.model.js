const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class SupportHistory extends Model {
    static associate(models) {
      SupportHistory.belongsTo(models.SupportUpload, {
        foreignKey: 'supportUploadId',
        as: 'upload',
      });

      SupportHistory.belongsTo(models.ContractSupport, {
        foreignKey: 'contractSupportId',
        as: 'contractSupport',
      });

      SupportHistory.belongsTo(models.UserContractRole, {
        foreignKey: 'usersContractId',
        as: 'actor',
      });
    }
  }

  SupportHistory.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

      supportUploadId: { 
        type: DataTypes.INTEGER, 
        allowNull: true, 
        comment: 'Carga del soporte asociada a este registro histórico'
      },

      contractSupportId: { 
        type: DataTypes.INTEGER, 
        allowNull: true, 
        comment: 'Soporte contractual vinculado'
      },

      usersContractId: { 
        type: DataTypes.INTEGER, 
        allowNull: true, 
        comment: 'Usuario (asociado al contrato) que realizó la acción'
      },

      status: { 
        type: DataTypes.ENUM('pending', 'approved', 'rejected'), 
        defaultValue: 'pending' 
      },

      comment: { 
        type: DataTypes.TEXT, 
        allowNull: true, 
        comment: 'Comentario o razón del cambio de estado'
      },
    },
    {
      sequelize,
      modelName: 'SupportHistory',
      tableName: 'support_history',
      timestamps: true,
      underscored: true,
    }
  );

  return SupportHistory;
};
