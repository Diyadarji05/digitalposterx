// backend/config/dbMongo.js
const mongoose = require('mongoose');

async function connectMongo(uri) {
  if (!uri) throw new Error('MONGO_URI not provided');
  return mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log('Connected to MongoDB');
    return mongoose;
  });
}

module.exports = connectMongo;
