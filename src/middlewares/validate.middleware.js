const { errorResponse } = require('../core/models/Response.model');

function validateSchema(schema) {
  return (req, res, next) => {
    try {
      schema.parse(req.body); // valida el cuerpo de la petición
      next();
    } catch (error) {
      const issues = error.errors?.map(e => e.message) || ['Error de validación'];
      return errorResponse(res, issues.join(', '), 400);
    }
  };
}

module.exports = { validateSchema };