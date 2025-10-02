// Test script to test the delete payment API endpoint
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Import models and controllers
const Payment = require('./models/Payment');
const { deletePayment } = require('./controllers/paymentController');

const app = express();
app.use(cors());
app.use(express.json());

const testDeleteAPI = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            w: 'majority',
        });
        console.log('✅ MongoDB Connected for API testing!');

        // Create test data for payments
        const payments = await Payment.find({}).limit(3);
        console.log(`Found ${payments.length} payments in database`);

        if (payments.length === 0) {
            console.log('No payments found. Create a payment first to test deletion.');
            return;
        }

        payments.forEach((payment, index) => {
            console.log(`${index + 1}. ${payment.invoiceId} - ${payment.paymentStatus} - LKR ${payment.totalAmount}`);
        });

        // Test the delete API function directly
        const testPayment = payments[0];
        console.log(`\nTesting deletion of payment: ${testPayment.invoiceId}`);

        // Create mock req and res objects
        const mockReq = {
            params: { paymentId: testPayment._id.toString() },
            user: { id: testPayment.cashier } // Use existing cashier ID
        };

        const mockRes = {
            status: (code) => ({
                json: (data) => {
                    console.log(`API Response [${code}]:`, data);
                    return { status: code, data };
                }
            })
        };

        // Call the delete function
        console.log('Calling deletePayment controller...');
        await deletePayment(mockReq, mockRes);

        // Check if payment was actually deleted
        const deletedPayment = await Payment.findById(testPayment._id);
        if (deletedPayment) {
            console.log('❌ Payment still exists after API call');
        } else {
            console.log('✅ Payment successfully deleted via API');
        }

    } catch (error) {
        console.error('❌ API Test error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
};

// Run the API test
testDeleteAPI();