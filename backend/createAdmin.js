// backend/createAdmin.js
require('dotenv').config();
const prisma = require('./config/dbSQL');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  try {
    const email = 'admin@dp.com';
    const existing = await prisma.user.findUnique({ where: { email } }).catch(()=>null);
    if (existing) {
      console.log('Admin already exists:', existing.email);
      process.exit(0);
    }
    const password = 'Admin@123';
    const hash = await bcrypt.hash(password, 10);
    const admin = await prisma.user.create({
      data: { name: 'Admin', email, passwordHash: hash, role: 'admin' }
    });
    console.log('Admin created', { id: admin.id, email: admin.email, password });
    process.exit(0);
  } catch (err) {
    console.error('createAdmin error', err);
    process.exit(1);
  }
}

createAdmin();
