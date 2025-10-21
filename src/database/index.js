const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(__dirname, '../../database.sqlite'),
  logging: false,
});

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