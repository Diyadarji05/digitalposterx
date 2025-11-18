// backend/controllers/authController.js
const prisma = require('../config/dbSQL');
const bcrypt = require('bcryptjs');
const { signToken } = require('../config/jwt');

async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already used' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: { name, email, passwordHash, role: 'customer' }
    });

    const token = signToken({ id: user.id, role: user.role, name: user.name });
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('register error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken({ id: user.id, role: user.role, name: user.name });
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('login error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

function me(req, res) {
  return res.json({ user: req.user });
}

module.exports = { register, login, me };
