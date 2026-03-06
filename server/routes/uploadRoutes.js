const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// Ensure /uploads dir exists locally
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// disk storage for Hostinger (permanent filesystem)
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${unique}${path.extname(file.originalname)}`);
    }
});

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
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// POST /api/upload — upload single image
router.post('/', protect, admin, upload.single('image'), (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        // Return relative path for database storage
        const filePath = `/uploads/${req.file.filename}`;
        res.json({ url: filePath, filename: req.file.filename });
    } catch (err) {
        res.status(500).json({ message: 'Error saving image', error: err.message });
    }
});

// POST /api/upload/multiple
router.post('/multiple', protect, admin, upload.array('images', 5), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }
        const urls = req.files.map(f => ({
            url: `/uploads/${f.filename}`,
            filename: f.filename
        }));
        res.json({ urls });
    } catch (err) {
        res.status(500).json({ message: 'Error saving images', error: err.message });
    }
});

// Multer Error Handling
router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: `Upload error: ${err.message}` });
    }
    next(err);
});

module.exports = router;
