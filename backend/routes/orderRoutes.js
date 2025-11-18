// backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { createOrder } = require('../controllers/orderController');
const { requireAuth } = require('../middleware/auth');

router.post('/create', requireAuth, createOrder);

module.exports = router;
