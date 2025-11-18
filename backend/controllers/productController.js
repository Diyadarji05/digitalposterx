// backend/controllers/productController.js
const Product = require('../models/productModel');

// List with server-side sorting, filtering, pagination
async function listProducts(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.max(1, parseInt(req.query.limit || '12', 10));
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const category = req.query.category;
    const headerSort = (req.headers['x-sort'] || '').toLowerCase();
    const sortOrder = headerSort === 'asc' ? 1 : -1; // 1 ascend, -1 descend

    const filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (category) filter.category = category;

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort({ price: sortOrder, updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.json({ data: products, meta: { total, page, limit } });
  } catch (err) {
    console.error('listProducts error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function createProduct(req, res) {
  try {
    const { sku, name, price, category } = req.body;
    if (!sku || !name || price == null || !category) return res.status(400).json({ message: 'Missing fields' });
    const exists = await Product.findOne({ sku });
    if (exists) return res.status(400).json({ message: 'SKU already exists' });

    const created = await Product.create({ sku, name, price, category });
    return res.status(201).json(created);
  } catch (err) {
    console.error('createProduct error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function updateProduct(req, res) {
  try {
    const id = req.params.id;
    const updates = req.body;
    updates.updatedAt = new Date();
    const updated = await Product.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    return res.json(updated);
  } catch (err) {
    console.error('updateProduct error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function deleteProduct(req, res) {
  try {
    const id = req.params.id;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('deleteProduct error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { listProducts, createProduct, updateProduct, deleteProduct };
