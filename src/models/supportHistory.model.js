export default (sequelize, DataTypes) => {
  const SupportHistory = sequelize.define('SupportHistory', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    supportUploadId: { type: DataTypes.INTEGER, allowNull: true },
    contractSupportId: { type: DataTypes.INTEGER, allowNull: true },
    usersContractId: { type: DataTypes.INTEGER, allowNull: true },
    status: { type: DataTypes.STRING, defaultValue: 'pending' },
    comment: { type: DataTypes.TEXT }
  }, {
    tableName: 'support_history',
    timestamps: true
  });

  SupportHistory.associate = (models) => {
    SupportHistory.belongsTo(models.SupportUpload, { foreignKey: 'supportUploadId' });
    SupportHistory.belongsTo(models.ContractSupport, { foreignKey: 'contractSupportId' });
    SupportHistory.belongsTo(models.UsersContracts, { foreignKey: 'usersContractId' });
  };

  return SupportHistory;
};