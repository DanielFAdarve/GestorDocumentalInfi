require('dotenv').config();
const { Sequelize } = require('sequelize');

console.log(process.env.DB_NAME);
console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);
console.log(process.env.DB_HOST);
console.log(process.env.DB_PORT);


const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: console.log,
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa');
  } catch (err) {
    console.error('❌ Error de conexión:', err);
  } finally {
    await sequelize.close();
  }
})();