// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const pc = require('../controllers/productController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.get('/', pc.listProducts);
router.post('/', requireAuth, requireAdmin, pc.createProduct);
router.put('/:id', requireAuth, requireAdmin, pc.updateProduct);
router.delete('/:id', requireAuth, requireAdmin, pc.deleteProduct);

module.exports = router;
