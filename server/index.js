// ─── Catch ALL crashes and log them ─────────────────
process.on('uncaughtException', (err) => {
    console.error('💥 UNCAUGHT EXCEPTION:', err.message);
    console.error(err.stack);
});
process.on('unhandledRejection', (reason) => {
    console.error('💥 UNHANDLED REJECTION:', reason);
});

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

console.log('✅ Modules loaded. Starting server...');
console.log('PORT env:', process.env.PORT);
console.log('MONGODB_URI env set:', !!process.env.MONGODB_URI);

const app = express();
const PORT = process.env.PORT || 3000;


// ─── CORS Configuration ──────────────────────────────
app.use(cors());

// Handle preflight requests for all routes
app.options(/(.*)/, cors());

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
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ─── Static file serving for uploaded images ─────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── MongoDB Connection (cached for serverless) ───────
const connectDB = require('./config/db');

// Ensure DB is connected before handling any requests
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error('❌ Database connection error:', err);
        res.status(503).json({ message: 'Database connecting error', error: err.message });
    }
});

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

// ─── Always start server (Hostinger needs this) ──────
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
}).on('error', (err) => {
    console.error('❌ Server failed to start:', err.message);
});

module.exports = app;
