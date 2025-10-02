// Test script to check if delete payment functionality works
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables with absolute path
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('Environment check:');
console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
console.log('MONGO_URI length:', process.env.MONGO_URI?.length || 0);

const Payment = require('./models/Payment');

const testDeletePayment = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            w: 'majority',
        });
        console.log('✅ MongoDB Connected for testing!');

        // Find a payment to test deletion
        const payments = await Payment.find({}).limit(1);
        
        if (payments.length === 0) {
            console.log('No payments found to test deletion');
            return;
        }

        const testPayment = payments[0];
        console.log('Found payment to test:', testPayment.invoiceId);
        
        // Try to delete it
        console.log('Attempting to delete payment...');
        const result = await Payment.findByIdAndDelete(testPayment._id);
        
        if (result) {
            console.log('✅ Payment deleted successfully:', result.invoiceId);
        } else {
            console.log('❌ Failed to delete payment');
        }

        // Check if it's really deleted
        const checkPayment = await Payment.findById(testPayment._id);
        if (checkPayment) {
            console.log('❌ Payment still exists after deletion');
        } else {
            console.log('✅ Payment confirmed deleted from database');
        }

    } catch (error) {
        console.error('❌ Test error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
};

// Run the test
testDeletePayment();