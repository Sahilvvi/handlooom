const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jannat_handloom';

mongoose.connect(MONGODB_URI).then(async () => {
    console.log('Connected to MongoDB');

    const UserSchema = new mongoose.Schema({
        firstName: String,
        lastName: String,
        email: { type: String, unique: true },
        password: String,
        role: { type: String, default: 'customer' }
    });

    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    const existing = await User.findOne({ email: 'admin@jannatloom.com' });
    if (existing) {
        console.log('Admin already exists:', existing.email);
        process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
        firstName: 'Admin',
        lastName: 'Jannat',
        email: 'admin@jannatloom.com',
        password: hashedPassword,
        role: 'admin'
    });
    await admin.save();
    console.log('Admin created successfully!');
    console.log('Email: admin@jannatloom.com');
    console.log('Password: admin123');
    process.exit(0);
}).catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
