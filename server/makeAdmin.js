/**
 * makeAdmin.js - Run this to promote a user to admin role
 * 
 * Usage:
 *   node makeAdmin.js user@example.com
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const email = process.argv[2];
if (!email) {
    console.error('❌ Usage: node makeAdmin.js <email>');
    process.exit(1);
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jannat_handloom';

mongoose.connect(MONGODB_URI).then(async () => {
    const user = await User.findOne({ email });
    if (!user) {
        console.error(`❌ No user found with email: ${email}`);
        process.exit(1);
    }
    user.role = 'admin';
    await user.save();
    console.log(`✅ ${user.firstName} ${user.lastName} (${email}) is now an admin.`);
    process.exit(0);
}).catch(err => {
    console.error('❌ DB error:', err.message);
    process.exit(1);
});
