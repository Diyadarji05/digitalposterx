// backend/seedProducts.js
require('dotenv').config();
const connectMongo = require('./config/dbMongo');
const Product = require('./models/productModel');

async function seed() {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI not configured. Set it in .env');
    process.exit(1);
  }
  await connectMongo(process.env.MONGO_URI);
  await Product.deleteMany({});
  const data = [
    {
  sku: 'P001',
  name: 'Sunset Poster',
  price: 300,
  category: 'nature',
  imageUrl: 'https://images.unsplash.com/photo-1501973801540-537f08ccae7b?q=80&w=1200&auto=format&fit=crop'
}
  ];
  await Product.insertMany(data);
  console.log('Seeded products');
  process.exit(0);
}

seed().catch(err => {
  console.error('seed error', err);
  process.exit(1);
});
