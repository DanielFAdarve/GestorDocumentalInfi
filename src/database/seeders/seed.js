const { sequelize } = require('../index');
const seedContracts = require('./fullSeed');  // tu archivo con la semilla

(async () => {
  try {
    await sequelize.sync({ force: false });

    await seedContracts(); // ejecuta la semilla

    console.log("Seed ejecutada correctamente");
    process.exit(0);
  } catch (err) {
    console.error("Error ejecutando seed:", err);
    process.exit(1);
  }
})();