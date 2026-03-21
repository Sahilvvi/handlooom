const express = require('express');
const { createRazorpayOrder, verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/orders', createRazorpayOrder); // Public/Logged-In for guest orders too
router.post('/verify', verifyPayment);

module.exports = router;
