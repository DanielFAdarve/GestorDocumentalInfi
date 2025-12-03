// class ContractRepository {
//   constructor(ContractModel, UserContractRoleModel) {
//     this.Contract = ContractModel;
//     this.UserContractRole = UserContractRoleModel;
//   }

//   async findAll() {
//     // return this.Contract.findAll({ include: ['company', 'resolution', 'users'] });
//     return this.Contract.findAll();
//   }

//   async findById(id) {
//     // return this.Contract.findByPk(id, { include: ['company', 'resolution', 'users'] });
//     return this.Contract.findByPk(id);
//   }

//   async findByCompanyId(id) {
//     // return this.Contract.findByPk(id, { include: ['company', 'resolution', 'users'] });
//     return this.Contract.findAll({ where: { companyId: id } });
//   }


//   async create(contractData, transaction = null) {
//     return this.Contract.create(contractData, { transaction });
//   }

//   async update(id, updates) {
//     const contract = await this.findById(id);
//     if (!contract) return null;
//     return contract.update(updates);
//   }

//   async delete(id) {
//     const contract = await this.findById(id);
//     if (!contract) return null;
//     await contract.destroy();
//     return true;
//   }

//   async assignUserRole(contractId, userId, roleId, transaction = null) {
//     return this.UserContractRole.create(
//       { contractId, userId, roleId },
//       { transaction }
//     );
//   }

//   async filter(field, value) {
//     const allowedFields = [
//       'dependency',
//       'contract_number',
//       'contract_type',
//       'status',
//       'companyId',
//       'userId'
//     ];


//     if (!allowedFields.includes(field)) {
//       throw new Error(`Campo no permitido para filtrar: ${field}`);
//     }


//     const where = {};
//     where[field] = value;

//     return this.Contract.findAll({
//       where,
//       // include: ['company', 'resolution', 'users']
//     });
//   }

//   // Reportes de contratos
//   async reportGeneral() {
//     return this.Contract.findAll({
//       order: [['id', 'DESC']]
//     });
//   }

//   async reportById(id) {
//     return this.Contract.findByPk(id, {
//       include: ['company', 'resolution']
//     });
//   }

//   async reportByStatus(status) {
//     return this.Contract.findAll({
//       where: { status },
//       order: [['start_date', 'DESC']]
//     });
//   }

//   async reportByDependency(dependency) {
//     return this.Contract.findAll({
//       where: { dependency },
//       order: [['start_date', 'DESC']]
//     });
//   }

//   async reportNearToExpire(days = 30) {
//     const now = new Date();
//     const limit = new Date();
//     limit.setDate(now.getDate() + days);

//     return this.Contract.findAll({
//       where: {
//         end_date: {
//           [Op.between]: [now, limit]
//         },
//         status: 'Activo'
//       }
//     });
//   }

//   async reportExpired() {
//     const now = new Date();

//     return this.Contract.findAll({
//       where: {
//         end_date: { [Op.lt]: now },
//         status: 'Activo'
//       }
//     });
//   }

// }

// module.exports = ContractRepository;

const { Op } = require('sequelize');

class ContractRepository {
  constructor(models) {
    this.Contract = models.Contract;
    this.UserContractRole = models.UserContractRole;
    this.models = models;
  }

  async findAll() {
    return this.Contract.findAll({
      include: [
        { model: this.models.Company, as: 'company' },
        { model: this.models.ContractType, as: 'contractType' },
        { model: this.models.User, as: 'users' },
        {
          model: this.models.ContractSupport,
          as: 'supports'
        },
        {
          model: this.models.ContractActivityReport,
          as: 'reports',
          include: [
            {
              model: this.models.ContractActivityReportItem,
              as: 'items'
            }
          ]
        },
        {
          model: this.models.ContractObligation,
          as: 'obligations',
          include: [
            {
              model: this.models.ContractObligationPeriod,
              as: 'periods',
              include: [
                {
                  model: this.models.ContractObligationAttachment,
                  as: 'attachments'
                }
              ]
            }
          ]
        }
      ]
    });
  }

  async findById(id) {
    return this.Contract.findByPk(id, {
      include: [
        { model: this.models.Company, as: 'company' },
        { model: this.models.ContractType, as: 'contractType' },
        { model: this.models.User, as: 'users' },
        {
          model: this.models.ContractSupport,
          as: 'supports'
        },
        {
          model: this.models.ContractActivityReport,
          as: 'reports',
          include: [
            {
              model: this.models.ContractActivityReportItem,
              as: 'items'
            }
          ]
        },
        {
          model: this.models.ContractObligation,
          as: 'obligations',
          include: [
            {
              model: this.models.ContractObligationPeriod,
              as: 'periods',
              include: [
                {
                  model: this.models.ContractObligationAttachment,
                  as: 'attachments'
                }
              ]
            }
          ]
        }
      ]
    });
  }

  async findByCompanyId(id) {
    return this.Contract.findAll({
      where: { company_id: id },
      include: [
        { model: this.models.Company, as: 'company' },
        { model: this.models.ContractType, as: 'contractType' }
      ]
    });
  }

  async create(contractData, transaction = null) {
    return this.Contract.create(contractData, { transaction });
  }

  async update(id, updates) {
    const contract = await this.findById(id);
    if (!contract) return null;
    return contract.update(updates);
  }

  async delete(id) {
    const contract = await this.findById(id);
    if (!contract) return null;
    await contract.destroy();
    return true;
  }

  async assignUserRole(contractId, userId, roleId, transaction = null) {
    return this.UserContractRole.create(
      { contract_id: contractId, user_id: userId, role_id: roleId },
      { transaction }
    );
  }

  async filter(field, value) {
    return this.Contract.findAll({
      where: { [field]: value },
      include: [
        { model: this.models.Company, as: 'company' },
        { model: this.models.ContractType, as: 'contractType' }
      ]
    });
  }

  async reportGeneral() {
    return this.findAll();
  }

  async reportById(id) {
    return this.findById(id);
  }

  async reportByStatus(status) {
    return this.Contract.findAll({
      where: { status },
      include: [
        { model: this.models.Company, as: 'company' },
        { model: this.models.ContractType, as: 'contractType' }
      ]
    });
  }

  async reportByDependency(dependency) {
    return this.Contract.findAll({
      where: { dependency },
      include: [
        { model: this.models.Company, as: 'company' },
        { model: this.models.ContractType, as: 'contractType' }
      ]
    });
  }

  async reportNearToExpire(days = 30) {
    const now = new Date();
    const limit = new Date();
    limit.setDate(now.getDate() + days);

    return this.Contract.findAll({
      where: {
        end_date: { [Op.between]: [now, limit] },
        status: 'Activo'
      }
    });
  }

  async reportExpired() {
    const now = new Date();

    return this.Contract.findAll({
      where: {
        end_date: { [Op.lt]: now },
        status: 'Activo'
      }
    });
  }
}

module.exports = ContractRepository;
