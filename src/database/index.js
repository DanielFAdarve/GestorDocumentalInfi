const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,


    //Pool de conexiones
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },

    // BLOQUEO DE OPERACIONES DDL
    // Deshabilitar todas las operaciones de sincronización automática
    define: {
      timestamps: false,
      freezeTableName: true,
      underscored: true
    },

    // Prevenir sync, alter y drop de tablas
    sync: { force: false },

    // Hook para prevenir operaciones DDL
    hooks: {
      beforeConnect: async (config) => {
        // Conexión permitida, pero sin permisos DDL
      }
    },

    dialectOptions: {
      connectTimeout: 60000
    }

  }
);

const models = {};
const modelsDir = path.join(__dirname, './models');

fs.readdirSync(modelsDir)
  .filter(file => file.endsWith('.js'))
  .forEach(file => {
    const defineModel = require(path.join(modelsDir, file));
    const model = defineModel(sequelize);

    if (!model || !model.name) {
      console.error('❌ ERROR: Modelo inválido en archivo:', file);
      return;
    }

    models[model.name] = model;
  });

Object.values(models).forEach(model => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
