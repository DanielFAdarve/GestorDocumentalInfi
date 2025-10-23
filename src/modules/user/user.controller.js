// controllers/user.controller.js
const { createUserSchema, updateUserSchema, loginUserSchema } = require('./user.schema');
const Response = require('../../core/models/Response.model');

class UserController {
  constructor(userService, jwtHelper) {
    this.userService = userService;
    this.jwtHelper = jwtHelper;
  }

  getAll = async (req, res, next) => {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json(Response.success('Usuarios obtenidos correctamente', users));
    } catch (err) {
      next(err);
    }
  };

  getById = async (req, res, next) => {
    try {
      const user = await this.userService.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json(Response.error('Usuario no encontrado', 404));
      }
      res.status(200).json(Response.success('Usuario obtenido correctamente', user));
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const validated = createUserSchema.parse(req.body);
      const user = await this.userService.createUser(validated);
      res.status(201).json(Response.success('Usuario creado correctamente', user, 201));
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      const validated = updateUserSchema.parse(req.body);
      const updatedUser = await this.userService.updateUser(req.params.id, validated);
      if (!updatedUser) {
        return res.status(404).json(Response.error('Usuario no encontrado', 404));
      }
      res.status(200).json(Response.success('Usuario actualizado correctamente', updatedUser));
    } catch (err) {
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const result = await this.userService.deleteUser(req.params.id);
      if (!result) {
        return res.status(404).json(Response.error('Usuario no encontrado', 404));
      }
      res.status(200).json(Response.success('Usuario eliminado correctamente', result));
    } catch (err) {
      next(err);
    }
  };

  login = async (req, res, next) => {
    try {
      const validated = loginUserSchema ? loginUserSchema.parse(req.body) : req.body;
      const { email, password } = validated;
      const result = await this.userService.authenticate(email, password, this.jwtHelper);
      res.status(200).json(Response.success('Inicio de sesión exitoso', result));
    } catch (err) {
      next(err);
    }
  };
}

module.exports = UserController;
