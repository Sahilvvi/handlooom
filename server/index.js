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

// ─── Self-Healing Asset Locator (Finds uploads dynamically safely) ───
const fs = require('fs');

let globalUploadBasePath = null;

// Only runs once sequentially down the hostinger root to find the actual user's folder
function initializeAssetLocator() {
    console.log('Searching Hostinger file tree for the hidden uploads folder...');
    const searchQueue = [path.join(__dirname, '../../')]; // start at /home/uXXXXX/domains/jannathandloom.com
    
    let iterations = 0;
    while(searchQueue.length > 0 && iterations < 3000) {
        iterations++;
        const currentDir = searchQueue.shift();
        
        try {
            const files = fs.readdirSync(currentDir);
            for (let f of files) {
                if (f === 'node_modules' || f.startsWith('.')) continue;
                
                const fullPath = path.join(currentDir, f);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory()) {
                    // Check if this directory specifically holds our products structure
                    if (f === 'products' && fs.existsSync(path.join(fullPath, '1/1.png'))) {
                         globalUploadBasePath = currentDir;
                         console.log('✅ AI Found true image path at: ', globalUploadBasePath);
                         return; // Done
                    }
                    searchQueue.push(fullPath);
                }
            }
        } catch(e) { } // Ignore permission denied folders
    }
    console.log('❌ Could not locate the products folder physically anywhere on Hostinger.');
}

// Fire the scanner once immediately
initializeAssetLocator();

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

// ─── Connect DB then start server ───────────────────
connectDB()
    .then(() => {
        const listenCallback = () => console.log(`🚀 Server running on: ${PORT}`);
        
        // Hostinger (Phusion Passenger) may provide a socket path in PORT
        // Socket paths MUST be listened to without an IP.
        if (isNaN(PORT)) {
            app.listen(PORT, listenCallback);
        } else {
            app.listen(PORT, '0.0.0.0', listenCallback);
        }
    })
    .catch(err => {
        console.error('❌ MongoDB connection failed, server not started:', err.message);
        process.exit(1);
    });

module.exports = app;
