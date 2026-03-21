require('dotenv').config();
const connectDB = require('./config/db');

async function test() {
    try {
        console.log('Testing DB connection...');
        await connectDB();
        console.log('Success!');
        process.exit(0);
    } catch(err) {
        console.error('Error connecting to DB:', err);
        process.exit(1);
    }
}
test();
