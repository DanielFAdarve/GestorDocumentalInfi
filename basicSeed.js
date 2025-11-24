// seed.js
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const models = require('./src/database'); // ← AJUSTA ESTA RUTA según tu proyecto

async function runSeed() {
  const {
    sequelize,
    User,
    Role,
    Company,
    Contract,
    ContractType,
    Support,
    ContractTypeSupport,
    UserCompanyRole,
    UserContractRole,
  } = models;

  try {
    console.log("🔄 Sincronizando base de datos...");
    await sequelize.sync({ force: true });

    console.log("🔹 Cargando roles base...");
    const roles = await Role.bulkCreate([
      { name: 'admin', description: 'Administrador del sistema' },
      { name: 'company_admin', description: 'Administrador de empresa' },
      { name: 'contract_responsible', description: 'Responsable contractual' },
      { name: 'uploader', description: 'Carga de soportes' }
    ]);

    console.log("🔹 Creando usuario administrador...");
    const admin = await User.create({
      name: "Administrador",
      email: "admin@demo.com",
      password: "admin123",
      user_type: "admin",
      area: "administrativa",
      createdBy: 1
    });

    console.log("🔹 Creando empresa de prueba...");
    const company = await Company.create({
      name: "Empresa de Ejemplo",
      tax_id: "900999888",
      createdBy: admin.id
    });

    // Relación usuario - empresa
    await UserCompanyRole.create({
      user_id: admin.id,
      company_id: company.id,
      role_id: roles.find(r => r.name === "admin").id
    });

    console.log("🔹 Cargando tipos de contrato (modalidades)...");
    const contractTypesMatrix = [
      { code: "MC01", name: "Mínima Cuantía", description: "Modalidad MC" },
      { code: "CDP01", name: "Contratación Directa", description: "CD" },
      { code: "LP01", name: "Licitación Pública", description: "LP" },
      { code: "CS01", name: "Concurso de Méritos", description: "CM" },
      { code: "SA01", name: "Subasta Inversa", description: "SI" },
      { code: "RC01", name: "Régimen Especial", description: "Especial" }
    ];

    const contractTypes = await ContractType.bulkCreate(contractTypesMatrix);

    console.log("🔹 Cargando soportes desde matriz...");
    // *** ESTA ES UNA SIMPLIFICACIÓN EJEMPLO ***
    // Cuando quieras cargar EXACTAMENTE el Excel, me confirmas y lo parseo completamente.

    const supportsMatrix = [
      // === PRECONTRACTUAL ===
      {
        name: "Estudios Previos",
        group: "Planeación",
        description: "Documento obligatorio",
        stage: "pre_contractual",
        contractTypes: ["MC01","CDP01","LP01","CS01"],
        requires_secop: true,
        requires_sia: false,
      },
      {
        name: "CDP",
        group: "Financiero",
        description: "Disponibilidad presupuestal",
        stage: "pre_contractual",
        contractTypes: ["MC01","CDP01","LP01","CS01","SA01"],
        requires_secop: true,
        requires_sia: false,
      },

      // === CONTRACTUAL ===
      {
        name: "Contrato Firmado",
        group: "Contractual",
        stage: "contractual",
        description: "Documento firmado",
        contractTypes: ["MC01","CDP01","LP01","CS01","SA01"],
        requires_secop: true,
        requires_sia: false,
      },
      {
        name: "Acta de Inicio",
        group: "Contractual",
        stage: "contractual",
        contractTypes: ["MC01","CDP01","LP01"],
        requires_secop: true,
        requires_sia: false,
      }
    ];

    const supportsCreated = [];

    for (const s of supportsMatrix) {
      const support = await Support.create({
        name: s.name,
        description: s.description,
        group: s.group,
        periodicity: "unico",
        applies_to: "contratista",
        requires_secop: s.requires_secop,
        requires_sia: s.requires_sia
      });

      supportsCreated.push({ support, meta: s });
    }

    console.log("🔹 Construyendo relaciones ContractTypeSupport...");

    for (const entry of supportsCreated) {
      const { support, meta } = entry;

      for (const ctCode of meta.contractTypes) {
        const ct = contractTypes.find(c => c.code === ctCode);

        await ContractTypeSupport.create({
          contract_type_id: ct.id,
          support_id: support.id,
          stage: meta.stage,
          is_required: true,
          order: 1,
          max_days_old: null,
          enforce_expiration: false,
          expiration_days: null
        });
      }
    }

    console.log("🔹 Creando contratos iniciales uno por tipo de contrato...");

    for (const ct of contractTypes) {
      const contract = await Contract.create({
        company_id: company.id,
        contract_number: `CT-${ct.code}-001`,
        contract_type_id: ct.id,
        contract_object: "Contrato de prueba para validación del sistema",
        dependency: "TIC",
        stage: "pre_contractual",
        status: "Activo",
        status_secop: "Pendiente_Creacion",
        status_sia: "Pendiente_Creacion",
        createdBy: admin.id
      });

      await UserContractRole.create({
        user_id: admin.id,
        contract_id: contract.id,
        role_id: roles.find(r => r.name === "contract_responsible").id
      });
    }

    console.log("✨ SEED COMPLETADO EXITOSAMENTE!");
    process.exit(0);

  } catch (error) {
    console.error("❌ Error ejecutando la seed:", error);
    process.exit(1);
  }
}

runSeed();
