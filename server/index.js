const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── CORS — must be FIRST before all other middleware ────
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:5174',
            'https://jannathandloom.com',
            'https://www.jannathandloom.com',
            'https://jannatloom.com',
            'https://www.jannatloom.com',
        ];
        // Allow requests with no origin (mobile apps, Postman, etc.)
        // Also allow any *.vercel.app preview deployment URL
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Handle OPTIONS preflight requests explicitly (Express 5 compatible wildcard)
app.options('/{*path}', cors());

// ─── Security Middleware ──────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { message: 'Too many requests from this IP, please try again after 15 minutes.' }
});
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { message: 'Too many login attempts, please try again later.' } });

app.use(limiter);

// ─── Standard Middleware ──────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Static file serving for uploaded images ─────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Routes ──────────────────────────────────────────
app.use('/api/auth', authLimiter, require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/banners', require('./routes/bannerRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// ─── Health check ────────────────────────────────────
app.get('/', (req, res) => res.json({ message: 'Jannat Handloom API ✅', version: '2.0' }));

// ─── Global Error Handler ────────────────────────────
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

// ─── MongoDB Connection (cached for serverless) ───────
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:Booyah%40123@cluster0.ldkdlzb.mongodb.net/Cluster0?appName=Cluster0';

let isConnected = false;

const connectDB = async () => {
    if (isConnected) return;
    try {
        await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
        isConnected = true;
        console.log('✅ Connected to MongoDB');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
        throw err;
    }
};

// Connect immediately on startup (for local mostly)
connectDB().catch(console.error);

// Ensure DB is connected before handling any requests
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        res.status(503).json({ message: 'Database connecting error', error: err.message });
    }
});

// ─── Start server locally (not on Vercel) ────────────
if (!process.env.VERCEL) {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

// Export the app for Vercel serverless
module.exports = app;
