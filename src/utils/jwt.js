const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'supersecretkey';
const EXPIRATION = '8h';

module.exports = {
  generateToken(payload) {
    return jwt.sign(payload, SECRET, { expiresIn: EXPIRATION });
  },
  verifyToken(token) {
    try {
      return jwt.verify(token, SECRET);
    } catch {
      return null;
    }
  },
};