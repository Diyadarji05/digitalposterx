// backend/config/jwt.js
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';

function signToken(payload, expiresIn = '7d') {
  return jwt.sign(payload, SECRET, { expiresIn });
}

function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

module.exports = { signToken, verifyToken };
