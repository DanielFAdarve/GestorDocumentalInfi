export default (sequelize, DataTypes) => {
  const SupportUpload = sequelize.define('SupportUpload', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    contractSupportId: { type: DataTypes.INTEGER, allowNull: false },
    usersContractId: { type: DataTypes.INTEGER, allowNull: true },
    file_hash: { type: DataTypes.STRING, allowNull: false },
    file_name: { type: DataTypes.STRING },
    uploaded_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
      validate: { isIn: [['pending','approved','rejected']] }
    },
    comment: { type: DataTypes.TEXT },
    createdBy: { type: DataTypes.INTEGER }
  }, {
    tableName: 'support_uploads',
    timestamps: true,
    paranoid: true
  });

  SupportUpload.associate = (models) => {
    SupportUpload.belongsTo(models.ContractSupport, { foreignKey: 'contractSupportId' });
    SupportUpload.belongsTo(models.UsersContracts, { foreignKey: 'usersContractId', as: 'uploader' });
    SupportUpload.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
    SupportUpload.hasMany(models.SupportHistory, { foreignKey: 'supportUploadId' });
  };

  return SupportUpload;
};