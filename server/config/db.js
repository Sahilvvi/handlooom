const mongoose = require('mongoose');

let MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('⚠️ MONGODB_URI is not defined in environment variables. Falling back to localhost for now/debugging.');
    MONGODB_URI = 'mongodb://localhost:27017/jannat'; // fallback
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            serverSelectionTimeoutMS: 5000,
            bufferCommands: false, // Error out immediately if not connected
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log('✅ MongoDB connected');
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

module.exports = connectDB;
