const express = require('express');
const { createRazorpayOrder, verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Public routes or protected
router.post('/order', createRazorpayOrder); // Anyone can start a payment
router.post('/verify', verifyPayment); // Verified with signature

module.exports = router;
