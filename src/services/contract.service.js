const Contract = require("../models/contract.model");
const Company = require("../models/company.model");
const Resolution = require("../models/resolution.model");

class ContractService {
  async createContract(data) {
    if (!data.contract_number || !data.contract_number.trim())
      return { success: false, message: "contract_number is required" };

    if (!data.start_date || isNaN(Date.parse(data.start_date)))
      return { success: false, message: "Valid start_date is required" };

    const company = await Company.findByPk(data.company_id);
    if (!company) return { success: false, message: "Invalid company_id" };

    const resolution = await Resolution.findByPk(data.resolution_id);
    if (!resolution) return { success: false, message: "Invalid resolution_id" };

    const contract = await Contract.create(data);
    return { success: true, data: contract };
  }

  async getAllContracts() {
    return await Contract.findAll({ include: [Company, Resolution] });
  }

  async getContractById(id) {
    const contract = await Contract.findByPk(id, { include: [Company, Resolution] });
    if (!contract) return { success: false, message: "Contract not found" };
    return { success: true, data: contract };
  }

  async updateContract(id, data) {
    const contract = await Contract.findByPk(id);
    if (!contract) return { success: false, message: "Contract not found" };

    if (data.company_id) {
      const company = await Company.findByPk(data.company_id);
      if (!company) return { success: false, message: "Invalid company_id" };
    }

    if (data.resolution_id) {
      const resolution = await Resolution.findByPk(data.resolution_id);
      if (!resolution) return { success: false, message: "Invalid resolution_id" };
    }

    await contract.update(data);
    return { success: true, data: contract };
  }

  async deleteContract(id) {
    const contract = await Contract.findByPk(id);
    if (!contract) return { success: false, message: "Contract not found" };

    await contract.destroy();
    return { success: true, message: "Contract deleted" };
  }
}

module.exports = new ContractService();
