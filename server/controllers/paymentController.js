const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_example_id',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_secret'
});

// Create Order (Razorpay)
exports.createRazorpayOrder = async (req, res) => {
    try {
        const { amount, currency = 'INR', receipt } = req.body;
        
        const options = {
            amount: amount * 100, // Amount in paise
            currency,
            receipt,
            payment_capture: 1
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (err) {
        console.error('Razorpay Order Error:', err);
        res.status(500).json({ message: 'Could not initiate Razorpay order' });
    }
};

// Verify Payment
exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        
        const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'your_secret');
        shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const digest = shasum.digest('hex');

        if (digest === razorpay_signature) {
            res.json({ status: 'success', message: 'Payment verified successfully' });
        } else {
            res.status(400).json({ status: 'failure', message: 'Signature verification failed' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error during verification' });
    }
};
