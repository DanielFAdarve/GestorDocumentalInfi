const AppError = require('../core/errors/AppError');
const jwtHelper = require('../utils/jwt');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new AppError('Token no proporcionado', 401));
  }

  const decoded = jwtHelper.verifyToken(token);
  if (!decoded) {
    return next(new AppError('Token inválido o expirado', 401));
  }

  req.user = decoded;
  next();
}

module.exports = authenticateToken;
