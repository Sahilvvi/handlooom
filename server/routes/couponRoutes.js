const express = require('express');
const { getAllCoupons, createCoupon, updateCoupon, deleteCoupon, validateCoupon } = require('../controllers/couponController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/validate', validateCoupon);                // Public: validate a coupon code
router.get('/', protect, admin, getAllCoupons);           // Admin: all coupons
router.post('/', protect, admin, createCoupon);          // Admin: create
router.put('/:id', protect, admin, updateCoupon);        // Admin: update
router.delete('/:id', protect, admin, deleteCoupon);     // Admin: delete

module.exports = router;
