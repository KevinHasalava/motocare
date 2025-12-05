// db.js
const mongoose = require('mongoose');

// Cache the database connection
let cachedConnection = null;

const connectDB = async () => {
  // If already connected, return cached connection
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log('✅ Using cached MongoDB connection');
    return cachedConnection;
  }

  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      // This option is essential for Mongoose transactions
      // It ensures write operations are replicated across a majority of nodes
      w: 'majority',
      // Serverless optimization
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    cachedConnection = connection;
    console.log('✅ MongoDB Connected!');
    return connection;
  } catch (error) {
    console.error('❌ Error: ', error.message);
    throw error; // Don't exit process in serverless environment
  }
};

module.exports = connectDB;