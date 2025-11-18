// backend/routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const { sqlDailyRevenue, mongoCategorySales } = require('../controllers/reportController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.get('/daily-revenue', requireAuth, requireAdmin, sqlDailyRevenue);
router.get('/category-sales', requireAuth, requireAdmin, mongoCategorySales);

module.exports = router;
