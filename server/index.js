// ─── Catch ALL crashes and log them ─────────────────
process.on('uncaughtException', (err) => {
    console.error('💥 UNCAUGHT EXCEPTION:', err.message);
    console.error(err.stack);
});
process.on('unhandledRejection', (reason) => {
    console.error('💥 UNHANDLED REJECTION:', reason);
});

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const fs = require('fs');

console.log('✅ Modules loaded. Starting server core...');

console.log('✅ Modules loaded. Starting server...');
console.log('PORT env:', process.env.PORT);
console.log('MONGODB_URI env set:', !!process.env.MONGODB_URI);

const app = express();
const PORT = process.env.PORT || 3000;


// ─── CORS Configuration ──────────────────────────────
app.use(cors());

// ─── Security Middleware ──────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// Standard Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Simplified Asset Serving (Uses standard public/uploads or similar)
const globalUploadBasePath = path.join(__dirname, 'uploads');

console.log('Static asset path configured at:', globalUploadBasePath);

app.use('/api/uploads', (req, res, next) => {
    let imgPath = req.path.split('?')[0];

    // Strip leading /uploads prefix if it exists to match the inner structure properly
    if (imgPath.startsWith('/uploads/')) {
        imgPath = imgPath.replace('/uploads/', '/');
    }

    if (globalUploadBasePath) {
        const exactPhysicalPath = path.join(globalUploadBasePath, imgPath);
        if (fs.existsSync(exactPhysicalPath)) {
            res.setHeader('Content-Type', 'image/' + path.extname(exactPhysicalPath).slice(1));
            // Add caching explicitly so standard CDNs embrace it
            res.setHeader('Cache-Control', 'public, max-age=31536000');
            return res.sendFile(exactPhysicalPath);
        }
    }
    res.status(404).send('Image physically missing on your hostinger paths.');
});

// Apply no limiter to avoid crash/access-denied issues on some Hostinger plans
// app.use('/api', limiter); 

// Top-level Health Check to satisfy Hostinger Health Checks
app.get('/api/health', (req, res) => res.status(200).send('OK'));
app.get('/health', (req, res) => res.status(200).send('OK'));


// ─── MongoDB Connection (connect ONCE at startup) ────
const connectDB = require('./config/db');

// ─── Routes ──────────────────────────────────────────
// ─── Routes ──────────────────────────────────────────
app.use('/api/auth', require('./routes/authRoutes'));
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
// Using a middleware catch-all is safer in Express 5 than problematic wildcard strings
app.use((req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'), (err) => {
        if (err) {
            res.status(404).json({ message: 'Jannat Handloom API ✅', version: '2.0', note: 'Frontend not found in server/public' });
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

// ─── Start listener IMMEDIATELY to avoid 503 Timeout ───
const server = app.listen(PORT, (err) => {
    if (err) {
        console.error('❌ Server Listen Error:', err.message);
        return;
    }
    console.log(`🚀 Production server alive and listening on: ${PORT}`);
    
    // Connect to DB in the BACKGROUND so the server is already 'up' for the proxy
    connectDB()
        .then(() => console.log('✅ Background MongoDB connection established.'))
        .catch(dbErr => console.error('⚠️ DB Error in background (server staying alive):', dbErr.message));
});

module.exports = server;
