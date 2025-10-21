const { Sequelize } = require('sequelize');
const db = require('../index.js');
const bcrypt = require('bcrypt');

const seedDatabase = async () => {
  const {
    User,
    Role,
    Company,
    UserCompanyRole,
    Resolution,
    Support,
    ResolutionSupport,
    Contract,
    UserContractRole,
    ContractSupport,
    SupportUpload,
    SupportHistory,
    sequelize
  } = db;

  const transaction = await sequelize.transaction();

  try {
    console.log('🌱 Iniciando seed de base de datos...\n');

    // 1️⃣ Roles base
    const roles = await Role.bulkCreate([
      { name: 'SuperAdmin', description: 'Acceso total al sistema' },
      { name: 'Delegado', description: 'Gestión documental y aprobaciones' },
      { name: 'Modificador', description: 'Puede subir y editar documentos' },
      { name: 'Lector', description: 'Solo lectura y descarga' }
    ], { transaction });
    console.log('✅ Roles creados');

    // 2️⃣ Empresas
    const companies = await Company.bulkCreate([
      { name: 'FYSEN S.A.S', tax_id: '901123456-1' },
      { name: 'MEDICAR S.A.S', tax_id: '901654321-2' }
    ], { transaction });
    console.log('✅ Compañías creadas');

    // 3️⃣ Usuarios base
    const hashedPassword = await bcrypt.hash('123456', 10);
    const users = await User.bulkCreate([
      { name: 'Admin General', email: 'admin@fysen.com', password: hashedPassword, user_type: 'SuperAdmin' },
      { name: 'Carlos Pérez', email: 'cperez@fysen.com', password: hashedPassword, user_type: 'Delegado' },
      { name: 'Laura Gómez', email: 'lgomez@medicar.com', password: hashedPassword, user_type: 'Modificador' },
      { name: 'Andrés Rojas', email: 'arojas@medicar.com', password: hashedPassword, user_type: 'Lector' },
    ], { transaction });
    console.log('✅ Usuarios creados');

    // 4️⃣ Relación Usuario ↔ Empresa
    await UserCompanyRole.bulkCreate([
      { userId: users[0].id, companyId: companies[0].id, roleId: roles[0].id },
      { userId: users[1].id, companyId: companies[0].id, roleId: roles[1].id },
      { userId: users[2].id, companyId: companies[1].id, roleId: roles[2].id },
      { userId: users[3].id, companyId: companies[1].id, roleId: roles[3].id },
    ], { transaction });
    console.log('✅ Relaciones usuario-empresa creadas');

    // 5️⃣ Resoluciones
    const resolutions = await Resolution.bulkCreate([
      { resolution_name: 'Resolución 1234 de 2024' },
      { resolution_name: 'Resolución 5678 de 2025' }
    ], { transaction });
    console.log('✅ Resoluciones creadas');

    // 6️⃣ Tipos de soportes
    const supports = await Support.bulkCreate([
      { support_name: 'Contrato firmado', description: 'Documento legal firmado por ambas partes', delivery_term: 30 },
      { support_name: 'Certificado de existencia', description: 'Documento expedido por Cámara de Comercio', delivery_term: 15 },
      { support_name: 'Póliza de cumplimiento', description: 'Seguro de cumplimiento del contrato', delivery_term: 60 }
    ], { transaction });
    console.log('✅ Tipos de soportes creados');

    // 7️⃣ Relación Resolución ↔ Soportes
    await ResolutionSupport.bulkCreate([
      { resolutionId: resolutions[0].id, supportId: supports[0].id },
      { resolutionId: resolutions[0].id, supportId: supports[1].id },
      { resolutionId: resolutions[1].id, supportId: supports[2].id },
    ], { transaction });
    console.log('✅ Resolución-Soporte relacionadas');

    // 8️⃣ Contratos
    const contracts = await Contract.bulkCreate([
      {
        contract_number: 'CT-001-FYSEN',
        start_date: new Date(),
        companyId: companies[0].id,
        resolutionId: resolutions[0].id
      },
      {
        contract_number: 'CT-002-MEDICAR',
        start_date: new Date(),
        companyId: companies[1].id,
        resolutionId: resolutions[1].id
      }
    ], { transaction });
    console.log('✅ Contratos creados');

    // 9️⃣ Usuarios ↔ Contratos
    const userContracts = await UserContractRole.bulkCreate([
      { userId: users[1].id, contractId: contracts[0].id, roleId: roles[1].id },
      { userId: users[2].id, contractId: contracts[1].id, roleId: roles[2].id },
      { userId: users[3].id, contractId: contracts[1].id, roleId: roles[3].id },
    ], { transaction });
    console.log('✅ Relaciones usuario-contrato creadas');

    // 🔟 Soportes requeridos por contrato
    const contractSupports = await ContractSupport.bulkCreate([
      { contractId: contracts[0].id, supportId: supports[0].id, status: 'pending' },
      { contractId: contracts[0].id, supportId: supports[1].id, status: 'pending' },
      { contractId: contracts[1].id, supportId: supports[2].id, status: 'pending' },
    ], { transaction });
    console.log('✅ Soportes por contrato creados');

    // 11️⃣ Cargas de soportes
    const uploads = await SupportUpload.bulkCreate([
      {
        contractSupportId: contractSupports[0].id,
        userContractId: userContracts[0].id,
        file_hash: 'hash_abc123',
        file_name: 'contrato_firmado.pdf',
        createdBy: users[1].id,
        status: 'approved'
      },
      {
        contractSupportId: contractSupports[2].id,
        userContractId: userContracts[1].id,
        file_hash: 'hash_def456',
        file_name: 'poliza_cumplimiento.pdf',
        createdBy: users[2].id,
        status: 'pending'
      }
    ], { transaction });
    console.log('✅ Cargas de soportes creadas');

    // 12️⃣ Historial de seguimiento
    await SupportHistory.bulkCreate([
      {
        supportUploadId: uploads[0].id,
        contractSupportId: contractSupports[0].id,
        userContractId: userContracts[0].id,
        status: 'approved',
        comment: 'Documento validado correctamente'
      },
      {
        supportUploadId: uploads[1].id,
        contractSupportId: contractSupports[2].id,
        userContractId: userContracts[1].id,
        status: 'pending',
        comment: 'Esperando validación del supervisor'
      }
    ], { transaction });
    console.log('✅ Historial de soporte creado');

    // 💾 Confirmar transacción
    await transaction.commit();
    console.log('\n🎉 Seed completado correctamente');
  } catch (error) {
    await transaction.rollback();
    console.error('❌ Error en seed:', error);
  } finally {
    await sequelize.close();
  }
};

seedDatabase();
