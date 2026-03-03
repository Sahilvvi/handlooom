const Coupon = require('../models/Coupon');

// GET all (admin)
exports.getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.json(coupons);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST create (admin)
exports.createCoupon = async (req, res) => {
    try {
        const coupon = new Coupon(req.body);
        await coupon.save();
        res.status(201).json(coupon);
    } catch (err) { res.status(400).json({ message: err.message }); }
};

// PUT update (admin)
exports.updateCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(coupon);
    } catch (err) { res.status(400).json({ message: err.message }); }
};

// DELETE (admin)
exports.deleteCoupon = async (req, res) => {
    try {
        await Coupon.findByIdAndDelete(req.params.id);
        res.json({ message: 'Coupon deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST validate coupon (public)
exports.validateCoupon = async (req, res) => {
    try {
        const { code, orderAmount } = req.body;
        const coupon = await Coupon.findOne({ code: code?.toUpperCase(), isActive: true });
        if (!coupon) return res.status(404).json({ message: 'Invalid coupon code' });
        if (coupon.expiresAt && new Date() > coupon.expiresAt) return res.status(400).json({ message: 'Coupon has expired' });
        if (coupon.usedCount >= coupon.maxUses) return res.status(400).json({ message: 'Coupon usage limit reached' });
        if (orderAmount < coupon.minOrderAmount) return res.status(400).json({ message: `Minimum order ₹${coupon.minOrderAmount} required` });

        const discount = coupon.discountType === 'percentage'
            ? Math.round(orderAmount * coupon.discountValue / 100)
            : coupon.discountValue;

        res.json({ valid: true, discount, coupon: { code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue } });
    } catch (err) { res.status(500).json({ message: err.message }); }
};
