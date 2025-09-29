const UserService = require("../services/user.service");
const Response = require("../models/Response.model");

class UserController {
  async create(req, res) {
    const result = await UserService.createUser(req.body);
    if (!result.success) return res.status(400).json(Response.set(400, false, result.message));
    return res.json(Response.set(201, true, result.data));
  }

  async getAll(req, res) {
    const users = await UserService.getAllUsers();
    return res.json(Response.set(users));
  }

  async getById(req, res) {
    const result = await UserService.getUserById(req.params.id);
    if (!result.success) return res.status(404).json(Response.set(404, false, result.message));
    return res.json(Response.set(result.data));
  }

  async update(req, res) {
    const result = await UserService.updateUser(req.params.id, req.body);
    if (!result.success) return res.status(400).json(Response.set(400, false, result.message));
    return res.json(Response.set(200, true, result.data));
  }

  async delete(req, res) {
    const result = await UserService.deleteUser(req.params.id);
    if (!result.success) return res.status(404).json(Response.set(404, false, result.message));
    return res.json(Response.set(200, true, result.message));
  }
}

module.exports = new UserController();
