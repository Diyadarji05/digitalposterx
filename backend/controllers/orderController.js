// backend/controllers/orderController.js
const prisma = require('../config/dbSQL');
const Product = require('../models/productModel');

async function createOrder(req, res) {
  try {
    const userId = req.user.id;
    const { items } = req.body; // [{ productId, quantity }]

    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'No items' });

    // Fetch products from Mongo
    const productIds = items.map(i => i.productId);
    const products = await Product.find({ _id: { $in: productIds } }).lean();
    const productMap = {};
    products.forEach(p => { productMap[p._id.toString()] = p; });

    let total = 0;
    const orderItemsData = items.map(i => {
      const p = productMap[i.productId];
      const price = p ? p.price : 0;
      total += price * i.quantity;
      return {
        productId: i.productId,
        quantity: i.quantity,
        priceAtPurchase: price
      };
    });

    // Save order in SQL via Prisma
    const createdOrder = await prisma.order.create({
      data: {
        userId,
        total,
        items: {
          create: orderItemsData.map(oi => ({
            productId: oi.productId,
            quantity: oi.quantity,
            priceAtPurchase: oi.priceAtPurchase
          }))
        }
      },
      include: { items: true }
    });

    return res.status(201).json({ orderId: createdOrder.id, total });
  } catch (err) {
    console.error('createOrder error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { createOrder };
