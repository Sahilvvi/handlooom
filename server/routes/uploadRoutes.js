const express = require('express');
const multer = require('multer');
const path = require('path');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// Use memory storage for Vercel (read-only filesystem)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    if (allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed (jpg, png, webp, gif)'));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 4 * 1024 * 1024 } // 4MB limit for Vercel
});

// POST /api/upload — upload single image
router.post('/', protect, admin, upload.single('image'), (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const b64 = req.file.buffer.toString('base64');
        const dataUrl = `data:${req.file.mimetype};base64,${b64}`;

        res.json({ url: dataUrl, filename: req.file.originalname });
    } catch (err) {
        res.status(500).json({ message: 'Error processing image', error: err.message });
    }
});

// POST /api/upload/multiple — upload multiple images
router.post('/multiple', protect, admin, upload.array('images', 5), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const urls = req.files.map(f => {
            const b64 = f.buffer.toString('base64');
            return {
                url: `data:${f.mimetype};base64,${b64}`,
                filename: f.originalname
            };
        });

        res.json({ urls });
    } catch (err) {
        res.status(500).json({ message: 'Error processing images', error: err.message });
    }
});

// Multer Error Handling Middleware
router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File too large. Max limit is 4MB.' });
        }
        return res.status(400).json({ message: err.message });
    }
    next(err);
});

module.exports = router;
