// backend/controllers/reportController.js
const prisma = require('../config/dbSQL');
const Product = require('../models/productModel');

async function sqlDailyRevenue(req, res) {
  try {
    const result = await prisma.$queryRaw`
      SELECT COALESCE(SUM(total), 0)::float AS "dailyRevenue" FROM "Order"
      WHERE DATE("createdAt") = CURRENT_DATE;
    `;
    return res.json({ dailyRevenue: result[0]?.dailyRevenue ?? 0 });
  } catch (err) {
    console.error('sqlDailyRevenue error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function mongoCategorySales(req, res) {
  try {
    const agg = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    return res.json(agg);
  } catch (err) {
    console.error('mongoCategorySales error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { sqlDailyRevenue, mongoCategorySales };
