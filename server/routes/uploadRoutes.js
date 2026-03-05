const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// Ensure /uploads dir exists (skipped on Vercel read-only filesystem)
const uploadsDir = path.join(__dirname, '../uploads');
try {
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
} catch (e) {
    console.warn('Could not create uploads dir (read-only filesystem on Vercel):', e.message);
}

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

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// POST /api/upload — upload single image (admin only)
router.post('/', protect, admin, upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ url: fileUrl, filename: req.file.filename });
});

// POST /api/upload/multiple — upload multiple images (up to 5)
router.post('/multiple', protect, admin, upload.array('images', 5), (req, res) => {
    if (!req.files?.length) return res.status(400).json({ message: 'No files uploaded' });
    const urls = req.files.map(f => ({
        url: `${req.protocol}://${req.get('host')}/uploads/${f.filename}`,
        filename: f.filename
    }));
    res.json({ urls });
});

module.exports = router;
