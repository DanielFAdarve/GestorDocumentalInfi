const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

class UserService {
  async createUser(data) {
    try {
      // Validaciones
      if (!data.name || typeof data.name !== "string" || data.name.trim() === "")
        return { success: false, message: "Name is required" };

      if (!data.email || typeof data.email !== "string" || data.email.trim() === "")
        return { success: false, message: "Email is required" };

      if (data.user_type && !["admin", "normal"].includes(data.user_type))
        return { success: false, message: "user_type must be 'admin' or 'normal'" };

      // Verificar si ya existe
      const exists = await User.findOne({ where: { email: data.email } });
      if (exists) return { success: false, message: "Email already registered" };

      // Si no hay password → generar una temporal aleatoria
      let plainPassword = data.password;
      if (!plainPassword || typeof plainPassword !== "string" || plainPassword.trim() === "") {
        plainPassword = crypto.randomBytes(6).toString("hex"); // Ejemplo: "a3f9c1d2b4e5"
      }

      // Hashear contraseña
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      // Crear usuario
      const user = await User.create({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        user_type: data.user_type || "normal",
      });

      return {
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          user_type: user.user_type,
          temporary_password: data.password ? undefined : plainPassword, // Solo la devolvemos si fue generada
        },
      };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  async getAllUsers() {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "user_type"],
    });
    return users;
  }

  async getUserById(id) {
    const user = await User.findByPk(id, {
      attributes: ["id", "name", "email", "user_type"],
    });
    if (!user) return { success: false, message: "User not found" };
    return { success: true, data: user };
  }

  async updateUser(id, data) {
    const user = await User.findByPk(id);
    if (!user) return { success: false, message: "User not found" };

    if (data.email) {
      const exists = await User.findOne({ where: { email: data.email } });
      if (exists && exists.id !== id)
        return { success: false, message: "Email already in use" };
    }

    // Si actualiza contraseña → re-hash
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    await user.update(data);

    return {
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        user_type: user.user_type,
      },
    };
  }

  async deleteUser(id) {
    const user = await User.findByPk(id);
    if (!user) return { success: false, message: "User not found" };

    await user.destroy();
    return { success: true, message: "User deleted" };
  }
}

module.exports = new UserService();
