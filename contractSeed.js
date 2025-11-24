const path = require("path");
const xlsx = require("xlsx");

const db = require("./src/database/index");
const sequelize = db.sequelize;

const {
  Role,
  User,
  Company,
  ContractType,
  Support,
  Contract,
  ContractTypeSupport,
  UserContractRole
} = db;

module.exports = {
  up: async () => {
    console.log("=== Seed inicial del sistema ===");

    try {
      // =============================
      // 1. ROLES
      // =============================
      const roles = await Role.bulkCreate(
        [
          { id: 1, name: "Administrador", description: "Control total" },
          { id: 2, name: "Operador", description: "Operación de contratos" },
          { id: 3, name: "Supervisor", description: "Auditoría y revisión" }
        ],
        { ignoreDuplicates: true }
      );
      console.log("Roles creados");

      // =============================
      // 2. USUARIOS
      // =============================
      const users = await User.bulkCreate(
        [
          { id: 1, username: "admin", password: "123456", state: true, id_role: 1 },
          { id: 2, username: "operador1", password: "123456", state: true, id_role: 2 },
          { id: 3, username: "supervisor1", password: "123456", state: true, id_role: 3 }
        ],
        { ignoreDuplicates: true }
      );
      console.log("Usuarios creados");

      // =============================
      // 3. COMPANY BASE
      // =============================
      const [company] = await Company.findOrCreate({
        where: { id: 1 },
        defaults: { id: 1, name: "Empresa Base", nit: "900000001" }
      });
      console.log("Company creada");

      // =============================
      // 4. CONTRACT TYPES
      // =============================
      const CONTRACT_TYPES = [
        { code: "LP", name: "Licitación Pública" },
        { code: "SA-SI", name: "Selección abreviada - Subasta inversa" },
        { code: "SA-MC", name: "Selección abreviada de menor cuantía" },
        { code: "CM", name: "Concurso de méritos" },
        { code: "MC", name: "Mínima cuantía" },
        { code: "CD", name: "Contratación directa" }
      ];

      await ContractType.bulkCreate(CONTRACT_TYPES, { ignoreDuplicates: true });
      console.log("Tipos de contrato creados");

      const contractTypeList = await ContractType.findAll();

      const contractTypeMap = {};
      contractTypeList.forEach((t) => (contractTypeMap[t.name] = t.id));

      // =============================
      // 5. LEER EXCEL
      // =============================
      const excelPath = path.join(__dirname, "Matriz_Soportes_Agrupados.xlsx");
      const workbook = xlsx.readFile(excelPath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = xlsx.utils.sheet_to_json(sheet);

      console.log(`Soportes cargados desde Excel: ${rows.length}`);

      // =============================
      // 6. SOPORTES
      // =============================
      const supportsToInsert = rows.map((r) => {
        const fase =
          r["SECOP II - etapa"] === "Contrato"
            ? "contractual"
            : "pre_contractual";

        const reqSia = r["Siaobserva"] &&
          typeof r["Siaobserva"] === "string" &&
          r["Siaobserva"].toLowerCase() !== "no_aplica";

        return {
          name: r["Soporte"],
          description: r["Descripción"] || "",
          secop_stage: fase,
          requiere_siaobserva: reqSia
        };
      });

      await Support.bulkCreate(supportsToInsert, { ignoreDuplicates: true });
      console.log("Soportes creados");

      const allSupports = await Support.findAll();

      // =============================
      // 7. CONTRACT TYPE SUPPORT
      // =============================
      const ctsInsert = [];

      rows.forEach((r) => {
        const ctId = contractTypeList.find((ct) => ct.name === r["Modalidad"])?.id;
        const spId = allSupports.find((s) => s.name === r["Soporte"])?.id;

        if (!ctId || !spId) return;

        ctsInsert.push({
          contract_type_id: ctId,
          support_id: spId
        });
      });

      await ContractTypeSupport.bulkCreate(ctsInsert, { ignoreDuplicates: true });
      console.log("ContractTypeSupport generado");

      // =============================
      // 8. CONTRATOS BASE
      // =============================
      const contractsToInsert = contractTypeList.map((t, i) => ({
        company_id: company.id,
        contract_number: `BASE-${t.code}-${i + 1}`,
        contract_type_id: t.id,
        contract_object: `Contrato base de tipo ${t.name}`,
        dependency: "Otra",
        stage: "pre_contractual",
        status: "Activo",
        status_secop: "Pendiente_Creacion",
        status_sia: "Pendiente_Creacion",
        createdBy: 1
      }));

      await Contract.bulkCreate(contractsToInsert, {
        ignoreDuplicates: true
      });
      console.log("Contratos base creados");

      const allContracts = await Contract.findAll();

      // =============================
      // 9. ASIGNAR RESPONSABLES VIA UserContractRole
      // =============================
      const assignments = allContracts.map((c) => ({
        user_id: 2, // operador1 responsable por defecto
        contract_id: c.id,
        role_id: 2 // rol Operador
      }));

      await UserContractRole.bulkCreate(assignments, {
        ignoreDuplicates: true
      });

      console.log("Responsables asignados");

      console.log("=== SEED COMPLETADO SIN ERRORES ===");
    } catch (err) {
      console.error("❌ Error en seed:", err);
    }
  }
};
