const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Support extends Model {
    static associate(models) {
      Support.belongsToMany(models.ContractType, {
        through: models.ContractTypeSupport,
        foreignKey: 'support_id',
        as: 'contractTypes'
      });

      Support.hasMany(models.ContractSupport, { foreignKey: 'support_id', as: 'contractSupports' });
      Support.hasMany(models.SupportUpload, { foreignKey: 'support_id', as: 'uploads' });
    }
  }

  Support.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    code: { type: DataTypes.STRING, allowNull: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },

    // NUEVOS CAMPOS derivados de la matriz
    group: { type: DataTypes.STRING, allowNull: true }, // Ej: "Experiencia", "Cumplimiento"
    category: { type: DataTypes.STRING, allowNull: true }, // subgrupo opcional
    periodicity: { type: DataTypes.ENUM('unico','mensual','anual','semestral','otro'), allowNull: true },
    applies_to: { type: DataTypes.ENUM('contratista','empresa','ambos'), allowNull: true },

    delivery_term_days: { type: DataTypes.INTEGER, allowNull: true },
    requires_secop: { type: DataTypes.BOOLEAN, defaultValue: false },
    requires_sia: { type: DataTypes.BOOLEAN, defaultValue: false },

  }, {
    sequelize,
    modelName: 'Support',
    tableName: 'supports',
    timestamps: true,
    underscored: true,
    indexes: [{ fields: ['name'] }, { fields: ['group'] }]
  });

  return Support;
};
