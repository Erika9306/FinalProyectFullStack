const mongoose = require('mongoose');
const User = require('../../src/api/models/User');

 const connectDB = async () => {
  try {
    const urlDB = 'mongodb+srv://admin:123@cluster0.dtdw9s2.mongodb.net/MoviesLibrary?retryWrites=true&w=majority';

    await mongoose.connect(urlDB);
    console.log(' Connected to MongoDB');

  } catch (err) {
    console.error('Could not connect to MongoDB:', err.message);
       throw err;
  }
};

module.exports = connectDB;
