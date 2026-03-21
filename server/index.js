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
    max: 5000, 
    message: { message: 'Too many requests from this IP, please try again after 15 minutes.' }
});
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: { message: 'Too many login attempts, please try again later.' } });

// ─── Standard Middleware ──────────────────────────────
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ─── Bullet-Proof Static file serving for images ───────
const fs = require('fs');

app.use('/api/uploads', (req, res, next) => {
    // Prevent query strings from breaking the paths
    let imgPath = req.path.split('?')[0];

    // Try all the common Hostinger extraction paths where the user might have accidentally dropped the images
    const possiblePaths = [
        path.join(__dirname, 'uploads', imgPath),
        path.join(__dirname, '../public_html/uploads', imgPath),
        path.join(__dirname, '../public_html/uploads/uploads', imgPath),
        path.join(__dirname, '../../public_html/uploads', imgPath)
    ];

    for (let p of possiblePaths) {
        if (fs.existsSync(p)) {
            // Set headers completely removing HTML to fix CDN 422 errors
            res.setHeader('Content-Type', 'image/' + path.extname(p).slice(1));
            return res.sendFile(p);
        }
    }
    // If we reach here, file is TRULY missing across all possible directories
    // Return a graceful 404 rather than calling next() which serves index.html and crashes Hostinger CDN
    res.status(404).send('Image physically missing on your hostinger paths.');
});

// ─── Apply rate limit only to API routes ─────────────
app.use('/api', limiter);


// ─── MongoDB Connection (connect ONCE at startup) ────
const connectDB = require('./config/db');

// ─── Routes ──────────────────────────────────────────
app.use('/api/auth', authLimiter, require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/banners', require('./routes/bannerRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));

// ─── Health check & Frontend Serving ─────────────────
app.get('/api', (req, res) => res.json({ message: 'Jannat Handloom API ✅', version: '2.0' }));

// Serve the React frontend 'public' directory (we will build it here)
const frontendPath = path.join(__dirname, 'public');
app.use(express.static(frontendPath));

// All unknown routes should serve the React app (Client-side routing)
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'), (err) => {
        if (err) {
            res.json({ message: 'Jannat Handloom API ✅', version: '2.0', note: 'Frontend not found in server/public' });
        }
    });
});

// ─── Global Error Handler ────────────────────────────
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

// ─── Connect DB then start server ───────────────────
connectDB()
    .then(() => {
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Server running on port ${PORT}`);
        }).on('error', (err) => {
            console.error('❌ Server failed to start:', err.message);
        });
    })
    .catch(err => {
        console.error('❌ MongoDB connection failed, server not started:', err.message);
        process.exit(1);
    });

module.exports = app;
