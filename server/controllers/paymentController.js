const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

// Initialize Razorpay
// Note: These must be added to .env
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder'
});

// Create Order (Backend)
exports.createRazorpayOrder = async (req, res) => {
    try {
        const { amount, currency = 'INR', receipt = 'receipt_1' } = req.body;

        const options = {
            amount: Math.round(amount * 100), // Razorpay expects amount in paise
            currency,
            receipt,
            payment_capture: 1
        };

        const order = await razorpay.orders.create(options);
        
        if (!order) return res.status(500).json({ message: 'Error creating Razorpay order' });

        res.json(order);
    } catch (err) {
        console.error('Razorpay Error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Verify Payment Signature
exports.verifyPayment = async (req, res) => {
    try {
        const { 
            orderId, 
            razorpay_order_id, 
            razorpay_payment_id, 
            razorpay_signature 
        } = req.body;

        // Verify the signature
        const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder');
        shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const digest = shasum.digest('hex');

        if (digest !== razorpay_signature) {
            // Update order status to failed if signature mismatch
            if (orderId) {
                await Order.findByIdAndUpdate(orderId, { 
                    paymentStatus: 'failed'
                });
            }
            return res.status(400).json({ status: 'failure', message: 'Signature verification failed' });
        }

        // Update the order in database
        if (orderId) {
            await Order.findByIdAndUpdate(orderId, {
                paymentStatus: 'paid',
                paymentMode: 'Razorpay',
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature
            });
        }

        res.json({ status: 'success', message: 'Payment verified successfully' });
    } catch (err) {
        console.error('Verification Error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
