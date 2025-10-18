export default (sequelize, DataTypes) => {
  const UsersContracts = sequelize.define('UsersContracts', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    // roleId ya existirá y apunta a roles
    createdBy: { type: DataTypes.INTEGER, allowNull: true },
  }, {
    tableName: 'users_contracts',
    timestamps: true,
    paranoid: true, // deletedAt
    indexes: [
      { unique: true, fields: ['userId', 'contractId'] }
    ]
  });

  UsersContracts.associate = (models) => {
    UsersContracts.belongsTo(models.User, { foreignKey: 'userId' });
    UsersContracts.belongsTo(models.Contract, { foreignKey: 'contractId' });
    UsersContracts.belongsTo(models.Role, { foreignKey: 'roleId' });
    UsersContracts.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
  };

  return UsersContracts;
};