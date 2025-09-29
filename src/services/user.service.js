const User = require("../models/user.model");

class UserService {
  async createUser(data) {
    try {
      if (!data.name || typeof data.name !== "string" || data.name.trim() === "")
        return { success: false, message: "Name is required" };

      if (!data.email || typeof data.email !== "string" || data.email.trim() === "")
        return { success: false, message: "Email is required" };

      if (!data.password || typeof data.password !== "string" || data.password.trim() === "")
        return { success: false, message: "Password is required" };

      if (data.user_type && !["admin", "normal"].includes(data.user_type))
        return { success: false, message: "user_type must be 'admin' or 'normal'" };

      const exists = await User.findOne({ where: { email: data.email } });
      if (exists) return { success: false, message: "Email already registered" };

      const user = await User.create(data);
      return { success: true, data: user };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  async getAllUsers() {
    return await User.findAll();
  }

  async getUserById(id) {
    const user = await User.findByPk(id);
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

    await user.update(data);
    return { success: true, data: user };
  }

  async deleteUser(id) {
    const user = await User.findByPk(id);
    if (!user) return { success: false, message: "User not found" };

    await user.destroy();
    return { success: true, message: "User deleted" };
  }
}

module.exports = new UserService();
