// Check existing data in database
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

const checkExistingData = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            w: 'majority',
        });
        console.log('✅ MongoDB Connected!');

        // Check existing data
        const users = await User.find({});
        const payments = await Payment.find({});
        const jobs = await Job.find({});
        const vehicles = await Vehicle.find({});
        const services = await Service.find({});

        console.log('\n=== DATABASE CONTENT ===');
        console.log(`Users: ${users.length}`);
        users.forEach((user, i) => {
            console.log(`  ${i+1}. ${user.name} (${user.email}) - ${user.userType}`);
        });

        console.log(`\nPayments: ${payments.length}`);
        payments.forEach((payment, i) => {
            console.log(`  ${i+1}. ${payment.invoiceId} - ${payment.paymentStatus} - LKR ${payment.totalAmount}`);
        });

        console.log(`\nJobs: ${jobs.length}`);
        jobs.forEach((job, i) => {
            console.log(`  ${i+1}. ${job.jobId} - ${job.status}`);
        });

        console.log(`\nVehicles: ${vehicles.length}`);
        vehicles.forEach((vehicle, i) => {
            console.log(`  ${i+1}. ${vehicle.vehicleNumber} - ${vehicle.brand} ${vehicle.model}`);
        });

        console.log(`\nServices: ${services.length}`);
        services.forEach((service, i) => {
            console.log(`  ${i+1}. ${service.name} - LKR ${service.price}`);
        });

        console.log('\n======================');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
};

// Run the check
checkExistingData();