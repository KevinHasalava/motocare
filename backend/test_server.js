// Test script to debug server startup and payment processing
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config({ path: 'C:\\Users\\ASUS\\OneDrive\\Desktop\\Moto-Care\\backend\\.env' });

console.log('🔧 Testing server startup...');
console.log('Environment variables:');
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Found' : 'Missing');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Found' : 'Missing');

// Test MongoDB connection
const connectDB = async () => {
  try {
    console.log('🔗 Attempting MongoDB connection...');
    console.log('Connection string:', process.env.MONGO_URI);
    
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB Connected Successfully!');
    
    // Test basic operations
    console.log('📊 Database Stats:');
    console.log('Database Name:', mongoose.connection.name);
    console.log('Connection State:', mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected');
    
    return true;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    return false;
  }
};

// Test server setup
const testServer = async () => {
  const dbConnected = await connectDB();
  
  if (!dbConnected) {
    console.log('❌ Cannot start server without database connection');
    process.exit(1);
  }
  
  const app = express();
  
  // Basic middleware
  app.use(express.json());
  
  // Test route
  app.get('/', (req, res) => {
    res.json({ 
      message: 'Server is working!', 
      timestamp: new Date(),
      database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
  });
  
  // Test payment route
  app.post('/test-payment', (req, res) => {
    console.log('💳 Payment test endpoint hit:', req.body);
    res.json({ 
      message: 'Payment endpoint is working',
      receivedData: req.body 
    });
  });
  
  const PORT = process.env.PORT || 5000;
  
  const server = app.listen(PORT, () => {
    console.log(`🚀 Test Server running on port ${PORT}`);
    console.log(`📍 Test URL: http://localhost:${PORT}`);
    console.log(`💳 Payment Test URL: http://localhost:${PORT}/test-payment`);
    console.log('✅ Server startup successful!');
  });
  
  // Handle server errors
  server.on('error', (error) => {
    console.error('❌ Server Error:', error.message);
  });
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🔄 Shutting down gracefully...');
    server.close(() => {
      mongoose.connection.close(false, () => {
        console.log('✅ Server and database connections closed.');
        process.exit(0);
      });
    });
  });
};

// Run test
console.log('🏁 Starting server test...');
testServer().catch(error => {
  console.error('❌ Fatal Error:', error.message);
  process.exit(1);
});