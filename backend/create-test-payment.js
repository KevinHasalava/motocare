// Create test payment data to test deletion
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const Payment = require('./models/Payment');
const User = require('./models/User');
const Job = require('./models/Job');
const Vehicle = require('./models/Vehicle');
const Service = require('./models/Service');

const createTestPayment = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            w: 'majority',
        });
        console.log('✅ MongoDB Connected for creating test payment!');

        // Find existing data
        let user = await User.findOne({ userType: 'customer' });
        let cashier = await User.findOne({ userType: { $in: ['admin', 'cashier'] } });
        let vehicle = await Vehicle.findOne();
        let service = await Service.findOne();
        let job = await Job.findOne({ status: { $in: ['Complete', 'Completed'] } });

        if (!user || !cashier || !vehicle || !service) {
            console.log('Missing required data. Creating sample data...');
            
            // Create sample data if not exists
            if (!user) {
                user = new User({
                    name: 'Test Customer',
                    email: 'customer@test.com',
                    password: 'hashedpassword123',
                    userType: 'customer'
                });
                await user.save();
            }

            if (!cashier) {
                cashier = new User({
                    name: 'Test Cashier',
                    email: 'cashier@test.com',
                    password: 'hashedpassword123',
                    userType: 'cashier'
                });
                await cashier.save();
            }

            if (!service) {
                service = new Service({
                    name: 'Basic Service',
                    description: 'Basic motorcycle service',
                    price: 2500,
                    duration: 120
                });
                await service.save();
            }

            if (!vehicle) {
                vehicle = new Vehicle({
                    vehicleNumber: 'TEST123',
                    type: 'Motorcycle',
                    brand: 'Honda',
                    model: 'CB150R',
                    year: 2020,
                    owner: user._id,
                    ownerName: user.name
                });
                await vehicle.save();
            }

            if (!job) {
                job = new Job({
                    jobId: 'JOB001',
                    user: user._id,
                    vehicle: vehicle._id,
                    service: service._id,
                    status: 'Completed',
                    scheduledDate: new Date(),
                    scheduledTime: '09:00'
                });
                await job.save();
            }
        }

        // Create a test payment
        const testPayment = new Payment({
            job: job._id,
            vehicle: vehicle._id,
            customer: user._id,
            service: service._id,
            serviceAmount: service.price,
            extraItems: [],
            subtotal: service.price,
            discount: 0,
            discountPercentage: 0,
            totalAmount: service.price,
            paymentMethod: 'Cash',
            paymentStatus: 'Paid',
            cashier: cashier._id,
            notes: 'Test payment for deletion'
        });

        await testPayment.save();
        console.log('✅ Test payment created:', testPayment.invoiceId);
        console.log('Payment ID:', testPayment._id);
        console.log('Payment details:', {
            customer: user.name,
            vehicle: vehicle.vehicleNumber,
            amount: testPayment.totalAmount,
            cashier: cashier.name
        });

        return testPayment._id;

    } catch (error) {
        console.error('❌ Error creating test payment:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
};

// Run the creation
createTestPayment();