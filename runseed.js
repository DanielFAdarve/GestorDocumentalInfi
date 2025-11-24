const seed = require("./contractSeed");

(async () => {
  try {
    await seed.up();
    console.log("✔ SEED EJECUTADA CORRECTAMENTE");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error en seed:", err);
    process.exit(1);
  }
})();
