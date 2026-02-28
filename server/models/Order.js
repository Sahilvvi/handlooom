const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 }
});

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [orderItemSchema],
    shippingAddress: {
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        address: String,
        city: String,
        state: String,
        pincode: String
    },
    paymentMode: { type: String, enum: ['UPI', 'Card', 'COD'], default: 'COD' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    orderStatus: {
        type: String,
        enum: ['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'placed'
    },
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    orderNumber: { type: String, unique: true }
}, { timestamps: true });

// Auto-generate order number
orderSchema.pre('save', function (next) {
    if (!this.orderNumber) {
        this.orderNumber = 'JANNAT-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 100);
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);
