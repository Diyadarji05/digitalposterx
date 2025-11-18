// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// DB and routes
const connectMongo = require('./config/dbMongo');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// connect to Mongo (if MONGO_URI is set). If connection fails, we catch and continue.
if (process.env.MONGO_URI) {
  connectMongo(process.env.MONGO_URI).catch(err => {
    console.error('Mongo connection error:', err.message || err);
    // Do not exit: allow server to run for development even if Mongo is not ready.
  });
}

// Initialize Prisma client (will not block if DATABASE_URL missing until used)
try {
  require('./config/dbSQL');
} catch (e) {
  console.warn('Prisma client init warning:', e.message);
}

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reports', reportRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on ${PORT}`));
