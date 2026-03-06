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

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// POST /api/upload — upload single image
router.post('/', protect, admin, upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    // Convert to Base64 Data URL for Vercel support
    const b64 = req.file.buffer.toString('base64');
    const dataUrl = `data:${req.file.mimetype};base64,${b64}`;

    res.json({ url: dataUrl, filename: req.file.originalname });
});

// POST /api/upload/multiple — upload multiple images
router.post('/multiple', protect, admin, upload.array('images', 5), (req, res) => {
    if (!req.files?.length) return res.status(400).json({ message: 'No files uploaded' });

    const urls = req.files.map(f => {
        const b64 = f.buffer.toString('base64');
        return {
            url: `data:${f.mimetype};base64,${b64}`,
            filename: f.originalname
        };
    });

    res.json({ urls });
});

module.exports = router;
