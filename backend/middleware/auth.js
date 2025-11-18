// backend/middleware/auth.js
const { verifyToken } = require('../config/jwt');
const prisma = require('../config/dbSQL');

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = { id: user.id, name: user.name, role: user.role };
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin required' });
  return next();
}

module.exports = { requireAuth, requireAdmin };
