const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// Create order (public - guests can order too)
exports.createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, paymentMode, subtotal, shippingCost, totalAmount } = req.body;
        const order = new Order({
            user: req.user?.id || null,
            items,
            shippingAddress,
            paymentMode,
            subtotal,
            shippingCost: shippingCost || 0,
            totalAmount,
            paymentStatus: paymentMode === 'COD' ? 'pending' : 'paid'
        });
        await order.save();
        res.status(201).json(order);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get all orders (Admin)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'firstName lastName email').sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get user's own orders
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get single order
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'firstName lastName email');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update order status (Admin)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus, paymentStatus } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { ...(orderStatus && { orderStatus }), ...(paymentStatus && { paymentStatus }) },
            { new: true }
        );
        res.json(order);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Dashboard stats (Admin)
exports.getDashboardStats = async (req, res) => {
    try {
        const [totalProducts, totalOrders, totalUsers, revenueAgg] = await Promise.all([
            Product.countDocuments(),
            Order.countDocuments(),
            User.countDocuments({ role: 'customer' }),
            Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }])
        ]);
        const revenue = revenueAgg[0]?.total || 0;
        const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'firstName lastName');
        res.json({ totalProducts, totalOrders, totalUsers, revenue, recentOrders });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
