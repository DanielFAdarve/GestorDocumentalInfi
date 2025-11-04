const AppError = require('../../core/errors/AppError');
const { js2xml } = require('xml-js');

class ReportsService {
  constructor(reportsRepository) {
    this.reportsRepository = reportsRepository;
  }

  async getObligations(contractNumber) {
    // 1️⃣ Buscar contrato base
    const contract = await this.reportsRepository.findContractWithSupports(contractNumber);
    if (!contract) {
      throw new AppError(`No se encontró el contrato ${contractNumber}`, 404);
    }

    // 2️⃣ Buscar todos los contratos con la misma dependencia
    const contractsSameDependency = await this.reportsRepository.findContractsByDependency(contract.dependency);

    // 3️⃣ Armar XML con todos los contratos de esa dependencia
    const dependencyGroup = {
      dependency: {
        _attributes: { name: contract.dependency },
        contracts: contractsSameDependency.map((c) => ({
          Contract: {
            _attributes: { contract_number: c.contract_number },
            contract_type: c.contract_type,
            contract_object: c.contract_object,
            status: c.status,
            start_date: c.start_date?.toISOString(),
            end_date: c.end_date?.toISOString(),
            supports: (c.supports || []).map((s) => ({
              Obligation: {
                id: s.id,
                supportId: s.supportId,
                userId: s.userId,
                status: s.status,
                file_hash: s.file_hash,
                createdAt: s.createdAt.toISOString(),
                updatedAt: s.updatedAt.toISOString(),
              },
            })),
          },
        })),
      },
    };

    const xml = js2xml(dependencyGroup, {
      compact: true,
      ignoreComment: true,
      spaces: 2,
    });

    return xml;
  }
}

module.exports = ReportsService;
