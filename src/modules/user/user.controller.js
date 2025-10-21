const { createUserSchema, updateUserSchema } = require('./user.schema');

class UserController {
  constructor(userService, jwtHelper) {
    this.userService = userService;
    this.jwtHelper = jwtHelper;
  }

  getAll = async (req, res, next) => {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req, res, next) => {
    try {
      const user = await this.userService.getUserById(req.params.id);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const validated = createUserSchema.parse(req.body);
      const user = await this.userService.createUser(validated);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      const validated = updateUserSchema.parse(req.body);
      const user = await this.userService.updateUser(req.params.id, validated);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const result = await this.userService.deleteUser(req.params.id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await this.userService.authenticate(email, password, this.jwtHelper);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = UserController;
