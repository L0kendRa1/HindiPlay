const mongoose = require('mongoose');

/**
 * Connect to MongoDB database instance using Mongoose.
 */
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hindiplay';

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.error('Please verify that MongoDB is running and MONGO_URI is set correctly.');
    throw error;
  }
};

module.exports = connectDB;
