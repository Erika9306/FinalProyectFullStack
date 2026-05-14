const mongoose = require('mongoose');
const User = require('../../src/api/models/User');

 const connectDB = async () => {
  try {
    const urlDB = process.env.MONGO_URI;

    await mongoose.connect(urlDB);
    console.log(' Connected to MongoDB');

  } catch (err) {
    console.error('Could not connect to MongoDB:', err.message);
       throw err;
  }
};

module.exports = connectDB;
