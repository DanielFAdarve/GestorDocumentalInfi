const express = require('express');
const UserController = require('./user.controller');

module.exports = (userService, jwtHelper) => {
  const router = express.Router();
  const controller = new UserController(userService, jwtHelper);

  // Autenticación
  router.post('/login', controller.login);

  // CRUD usuarios
  router.get('/', controller.getAll);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.delete);

  return router;
};
