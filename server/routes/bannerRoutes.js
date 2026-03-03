const express = require('express');
const { getAllBanners, getAllBannersAdmin, createBanner, updateBanner, deleteBanner } = require('../controllers/bannerController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getAllBanners);                           // Public: active banners
router.get('/all', protect, admin, getAllBannersAdmin);   // Admin: all banners
router.post('/', protect, admin, createBanner);          // Admin: create
router.put('/:id', protect, admin, updateBanner);        // Admin: update
router.delete('/:id', protect, admin, deleteBanner);     // Admin: delete

module.exports = router;
