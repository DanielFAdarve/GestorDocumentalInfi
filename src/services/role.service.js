const { Role } = require('../models');

class RoleService {
  // Crear un nuevo rol
  static async createRole(data) {
    try {
      const { name, description } = data;

      // Validar duplicados
      const existing = await Role.findOne({ where: { name } });
      if (existing) {
        throw { status: 400, message: `Role with name '${name}' already exists` };
      }

      const role = await Role.create({ name, description });
      return role;
    } catch (error) {
      throw error;
    }
  }

  // Obtener todos los roles
  static async getAllRoles() {
    try {
      return await Role.findAll();
    } catch (error) {
      throw error;
    }
  }

  // Obtener un rol por ID
  static async getRoleById(id) {
    try {
      return await Role.findByPk(id);
    } catch (error) {
      throw error;
    }
  }

  // Actualizar un rol
  static async updateRole(id, data) {
    try {
      const role = await Role.findByPk(id);
      if (!role) return null;

      if (data.name) {
        // Validar que el nuevo nombre no esté en uso por otro rol
        const existing = await Role.findOne({ where: { name: data.name } });
        if (existing && existing.id !== Number(id)) {
          throw { status: 400, message: `Role with name '${data.name}' already exists` };
        }
      }

      await role.update(data);
      return role;
    } catch (error) {
      throw error;
    }
  }

  // Eliminar un rol
  static async deleteRole(id) {
    try {
      const role = await Role.findByPk(id);
      if (!role) return null;

      await role.destroy();
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = RoleService;
