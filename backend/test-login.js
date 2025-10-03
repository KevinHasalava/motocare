const User = require('./models/User');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

async function testLogin() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            w: 'majority',
        });
        console.log('✅ MongoDB Connected for testing!');

        // First, let's check if there are any users
        const users = await User.find({});
        console.log(`Found ${users.length} users in database`);
        
        if (users.length > 0) {
            console.log('First user:', {
                name: users[0].name,
                email: users[0].email,
                userType: users[0].userType,
                hashedPassword: users[0].password.substring(0, 20) + '...'
            });
        }

        // If no users exist, create a test user
        if (users.length === 0) {
            console.log('Creating test user...');
            const testUser = new User({
                name: 'Test Admin',
                email: 'admin@test.com',
                phone: '1234567890',
                password: 'admin123',
                userType: 'admin'
            });
            await testUser.save();
            console.log('✅ Test user created!');
        }

        // Test login logic
        const email = users.length > 0 ? users[0].email : 'admin@test.com';
        const testPassword = 'admin123'; // You should replace with actual password

        console.log(`\nTesting login for: ${email}`);
        
        const user = await User.findOne({ email });
        if (!user) {
            console.log('❌ User not found');
            return;
        }

        console.log('✅ User found in database');
        
        // Test password comparison
        const isMatch = await bcrypt.compare(testPassword, user.password);
        console.log(`Password match result: ${isMatch}`);
        
        if (isMatch) {
            console.log('✅ Login would succeed!');
        } else {
            console.log('❌ Password does not match');
            
            // Let's check what the hashed password looks like
            console.log('Stored password hash:', user.password);
            
            // Try to manually hash the test password and compare
            const salt = await bcrypt.genSalt(10);
            const hashedTest = await bcrypt.hash(testPassword, salt);
            console.log('Newly hashed test password:', hashedTest);
        }

    } catch (error) {
        console.error('❌ Test error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('📴 Disconnected from MongoDB');
    }
}

testLogin();