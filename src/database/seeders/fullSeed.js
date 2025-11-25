'use strict';
const XLSX = require('xlsx');

module.exports = {
  async up(queryInterface, Sequelize) {

    const now = new Date();

    // -----------------------------------------------------------
    // 1. Usuario base admin
    // -----------------------------------------------------------
    const [adminUser] = await queryInterface.bulkInsert(
      'users',
      [{
        username: 'admin',
        password: 'admin123',
        id_profile: 1,
        state: true,
        created_at: now,
        updated_at: now
      }],
      { returning: ['id'] }
    );
    const adminId = adminUser.id || adminUser; 

    // -----------------------------------------------------------
    // 2. Leer la matriz completa de Excel
    // -----------------------------------------------------------
    const workbook = XLSX.readFile('Matriz_Soportes_Agrupados.xlsx');
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    // Limpieza de datos
    const clean = v => (v ? String(v).trim() : '');

    // -----------------------------------------------------------
    // 3. Obtener ContractTypes únicos
    // -----------------------------------------------------------
    const contractTypeNames = [...new Set(rows.map(r => clean(r['Modalidad'])))];

    const contractTypeRecords = contractTypeNames.map(name => ({
      name,
      description: `Tipo contractual ${name}`,
      created_by: adminId,
      updated_by: adminId,
      created_at: now,
      updated_at: now
    }));

    const insertedTypes = await queryInterface.bulkInsert(
      'contract_types',
      contractTypeRecords,
      { returning: ['id','name'] }
    );

    // Mapear name → id
    const contractTypeMap = {};
    for (const ct of insertedTypes) {
      contractTypeMap[ct.name] = ct.id;
    }

    // -----------------------------------------------------------
    // 4. SUPPORTS únicos
    // -----------------------------------------------------------
    const supportNames = [...new Set(rows.map(r => clean(r['Documento'])))];

    // Determinar stage, requires_secop, requires_sia
    const resolveStage = (row) => {
      const etapa = clean(row['SECOP II – Etapa']).toLowerCase();

      const preKeywords = [
        'registro adjudicación',
        'registro planeacion',
        'registro proceso'
      ];

      if (etapa.includes('contrato')) return 'contractual';

      if (preKeywords.some(k => etapa.includes(k))) return 'pre_contractual';

      return 'pre_contractual';
    };

    const resolveRequiresSecop = row =>
      clean(row['SECOP II – Etapa']).toLowerCase() !== 'no aplica';

    const resolveRequiresSIA = row =>
      clean(row['Registro en SIA']).toLowerCase() !== 'no aplica';

    const supportRecords = [];

    const supportIndexMap = {}; // name -> temp index

    supportNames.forEach(name => { supportIndexMap[name] = null; });

    // Insert supports with metadata extracted from first matching row
    supportNames.forEach(name => {
      const row = rows.find(r => clean(r['Documento']) === name);

      supportRecords.push({
        name,
        stage: resolveStage(row),
        description: clean(row['Breve descripción']) || null,
        legal_basis: clean(row['Fundamento legal']) || null,

        requires_secop: resolveRequiresSecop(row),
        requires_siaobserva: resolveRequiresSIA(row),

        created_by: adminId,
        updated_by: adminId,
        created_at: now,
        updated_at: now
      });
    });

    const insertedSupports = await queryInterface.bulkInsert(
      'supports',
      supportRecords,
      { returning: ['id','name'] }
    );

    const supportIdMap = {};
    insertedSupports.forEach(s => { supportIdMap[s.name] = s.id; });

    // -----------------------------------------------------------
    // 5. Mapeo SupportContractType
    // -----------------------------------------------------------
    const sctRows = [];

    rows.forEach((row, index) => {
      const modality = clean(row['Modalidad']);
      const doc = clean(row['Documento']);

      sctRows.push({
        contract_type_id: contractTypeMap[modality],
        support_id: supportIdMap[doc],
        is_required: true,
        order: index + 1,
        created_by: adminId,
        updated_by: adminId,
        created_at: now,
        updated_at: now
      });
    });

    await queryInterface.bulkInsert('support_contract_type', sctRows);

    // -----------------------------------------------------------
    // 6. Company por cada contractType
    // -----------------------------------------------------------
    const companies = contractTypeNames.map(name => ({
      name: `Entidad para ${name}`,
      nit: `900${Math.floor(Math.random()*900000+100000)}`,
      created_by: adminId,
      updated_by: adminId,
      created_at: now,
      updated_at: now
    }));

    const insertedCompanies = await queryInterface.bulkInsert(
      'companies',
      companies,
      { returning: ['id'] }
    );

    // -----------------------------------------------------------
    // 7. Crear un contrato por cada ContractType
    // -----------------------------------------------------------
    const contractRows = contractTypeNames.map((type, i) => ({
      company_id: insertedCompanies[i].id,
      contract_type_id: contractTypeMap[type],
      name: `Contrato Demo de ${type}`,
      description: `Contrato generado automáticamente para ${type}`,
      start_date: now,
      end_date: now,
      created_by: adminId,
      updated_by: adminId,
      created_at: now,
      updated_at: now
    }));

    const insertedContracts = await queryInterface.bulkInsert(
      'contracts',
      contractRows,
      { returning: ['id','contract_type_id'] }
    );

    // -----------------------------------------------------------
    // 8. ContractSupport para cada contrato
    // -----------------------------------------------------------
    const csRows = [];

    for (const contract of insertedContracts) {
      const contractTypeId = contract.contract_type_id;

      const supportsForType = sctRows.filter(
        sct => sct.contract_type_id === contractTypeId
      );

      supportsForType.forEach(sct => {
        csRows.push({
          contract_id: contract.id,
          support_id: sct.support_id,
          responsible_user_id: adminId,
          stage: 'pre_contractual', // luego puedes mejorar si deseas
          is_required: true,
          order: sct.order,
          status: 'pending',
          created_by: adminId,
          updated_by: adminId,
          created_at: now,
          updated_at: now
        });
      });
    }

    await queryInterface.bulkInsert('contract_supports', csRows);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('contract_supports', null, {});
    await queryInterface.bulkDelete('contracts', null, {});
    await queryInterface.bulkDelete('companies', null, {});
    await queryInterface.bulkDelete('support_contract_type', null, {});
    await queryInterface.bulkDelete('supports', null, {});
    await queryInterface.bulkDelete('contract_types', null, {});
    await queryInterface.bulkDelete('users', { username: 'admin' });
  }
};
