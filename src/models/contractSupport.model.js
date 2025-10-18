export default (sequelize, DataTypes) => {
  const ContractSupport = sequelize.define('ContractSupport', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    contractId: { type: DataTypes.INTEGER, allowNull: false },
    supportId: { type: DataTypes.INTEGER, allowNull: false },
    assignedUsersContractId: { // esta FK obliga a que el responsable sea un usuario asignado al contrato
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'assigned_users_contract_id'
    },
    status: { type: DataTypes.STRING, defaultValue: 'pending',
      validate: { isIn: [['pending','approved','rejected']] } },
    dueDate: { type: DataTypes.DATE, field: 'due_date' },
    mandatory: { type: DataTypes.BOOLEAN, defaultValue: false },
    file_hash: { type: DataTypes.STRING } // opcional, ver support_uploads
  }, {
    tableName: 'contract_supports',
    timestamps: true,
    paranoid: true
  });

  ContractSupport.associate = (models) => {
    ContractSupport.belongsTo(models.Contract, { foreignKey: 'contractId' });
    ContractSupport.belongsTo(models.Support, { foreignKey: 'supportId' });
    ContractSupport.belongsTo(models.UsersContracts, { foreignKey: 'assignedUsersContractId', as: 'assigned' });
    ContractSupport.hasMany(models.SupportUpload, { foreignKey: 'contractSupportId' });
  };

  return ContractSupport;
};