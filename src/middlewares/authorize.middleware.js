const AppError = require('../core/errors/AppError');

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const { user } = req;
    if (!user) {
      return next(new AppError('No autenticado', 401));
    }

    if (!allowedRoles.includes(user.user_type)) {
      return next(new AppError('Acceso denegado', 403));
    }

    next();
  };
}

module.exports = authorizeRoles;
