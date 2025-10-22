// schemas/userContractRoleSchema.js
const Joi = require('joi');

const createUserContractRoleSchema = Joi.object({
  userId: Joi.number().integer().required(),
  contractId: Joi.number().integer().required(),
  roleId: Joi.number().integer().required(),
});

const updateUserContractRoleSchema = Joi.object({
  userId: Joi.number().integer(),
  contractId: Joi.number().integer(),
  roleId: Joi.number().integer(),
});

module.exports = {
  createUserContractRoleSchema,
  updateUserContractRoleSchema,
};
