// backend/tests/sorting.test.js
const request = require('supertest');
const express = require('express');
const productRoutes = require('../routes/productRoutes');
const Product = require('../models/productModel');

const app = express();
app.use(express.json());
app.use('/api/products', productRoutes);

jest.mock('../models/productModel');

describe('Product sorting', () => {
  beforeEach(() => {
    Product.countDocuments.mockResolvedValue(3);
    Product.find.mockImplementation(() => ({
      sort: function() { return this; },
      skip: function() { return this; },
      limit: function() { return this; },
      lean: function() { return Promise.resolve([
        { name: 'A', price: 300 },
        { name: 'B', price: 200 },
        { name: 'C', price: 100 }
      ]); }
    }));
  });

  it('returns DESC by default', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body.data[0].price).toBeGreaterThan(res.body.data[2].price);
  });

  it('returns ASC when x-sort header is asc', async () => {
    Product.find.mockImplementation(() => ({
      sort: function() { return this; },
      skip: function() { return this; },
      limit: function() { return this; },
      lean: function() { return Promise.resolve([
        { name: 'C', price: 100 },
        { name: 'B', price: 200 },
        { name: 'A', price: 300 }
      ]); }
    }));

    const res = await request(app).get('/api/products').set('x-sort', 'asc');
    expect(res.status).toBe(200);
    expect(res.body.data[0].price).toBeLessThan(res.body.data[2].price);
  });
});
