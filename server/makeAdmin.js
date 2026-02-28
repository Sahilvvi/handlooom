const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config({ path: './server/.env' });

const MONGO = process.env.MONGODB_URI || 'mongodb://localhost:27017/jannat_handloom';

const UserSchema = new mongoose.Schema({
    firstName: String, lastName: String,
    email: { type: String, unique: true },
    password: String, role: { type: String, default: 'customer' }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

mongoose.connect(MONGO).then(async () => {
    const existing = await User.findOne({ email: 'admin@jannatloom.com' });
    if (existing) { console.log('Admin already exists!'); process.exit(0); }
    const hashed = await bcrypt.hash('admin123', 10);
    await User.create({
        firstName: 'Admin', lastName: 'Jannat',
        email: 'admin@jannatloom.com',
        password: hashed, role: 'admin'
    });
    console.log('Admin created successfully!');
    console.log('Email: admin@jannatloom.com | Password: admin123');
    process.exit(0);
}).catch(e => { console.error('Error:', e.message); process.exit(1); });
