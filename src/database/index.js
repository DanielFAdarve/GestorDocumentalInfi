const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // para leer variables del .env

// const sequelize = new Sequelize({
//   dialect: 'sqlite',
//   storage: path.resolve(__dirname, '../../database.sqlite'),
//   logging: false,
// });
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: console.log, // activa logs para ver más detalle
  }
);

const models = {};
const modelsDir = path.join(__dirname, '../database/models');

fs.readdirSync(modelsDir)
  .filter(file => file.endsWith('.js'))
  .forEach(file => {
    const defineModel = require(path.join(modelsDir, file));
    const model = defineModel(sequelize);
    models[model.name] = model;
  });

// Configurar asociaciones una vez cargados todos los modelos
Object.values(models).forEach(model => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;