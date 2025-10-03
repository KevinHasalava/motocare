const User = require('./models/User');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

async function fixUserPasswords() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            w: 'majority',
        });
        console.log('✅ MongoDB Connected for password fixing!');

        // Find all users with non-hashed passwords (typically shorter than 30 chars)
        const users = await User.find({});
        console.log(`Found ${users.length} users in database`);

        let fixedCount = 0;
        
        for (const user of users) {
            // Check if password is not hashed (hashed passwords are typically 60+ chars and start with $2b$)
            if (!user.password.startsWith('$2b$') && user.password.length < 30) {
                console.log(`Fixing password for user: ${user.email}`);
                
                // Hash the plain text password
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(user.password, salt);
                
                // Update the user with hashed password (bypass the pre-save middleware)
                await User.updateOne(
                    { _id: user._id }, 
                    { password: hashedPassword }
                );
                
                fixedCount++;
                console.log(`✅ Fixed password for ${user.email}`);
            } else {
                console.log(`✅ Password already hashed for ${user.email}`);
            }
        }

        console.log(`\n🔧 Fixed ${fixedCount} user passwords`);

        // Test login with the first user
        if (users.length > 0) {
            const testUser = users[0];
            console.log(`\nTesting login for: ${testUser.email}`);
            
            // Get the updated user
            const updatedUser = await User.findById(testUser._id);
            
            // Test with common passwords
            const testPasswords = ['admin123', '123456', 'password', testUser.password];
            
            for (const testPassword of testPasswords) {
                const isMatch = await bcrypt.compare(testPassword, updatedUser.password);
                if (isMatch) {
                    console.log(`✅ Password '${testPassword}' works for ${testUser.email}`);
                    break;
                }
            }
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('📴 Disconnected from MongoDB');
    }
}

fixUserPasswords();