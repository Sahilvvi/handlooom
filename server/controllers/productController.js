const Product = require('../models/Product');

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const products = await Product.find({ isActive: { $ne: false } })
            .select('name price images originalPrice category transparency material fastDelivery isActive colors room isBestSeller description')
            .sort({ _id: -1 }) // Newest first
            .skip(skip)
            .limit(limit)
            .lean();
        
        const total = await Product.countDocuments();
        
        res.json({
            products,
            total,
            page,
            pages: Math.ceil(total / limit)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create product (Admin only)
exports.createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update product (Admin only)
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete product (Admin only)
exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete ALL products (Admin only)
exports.deleteAllProducts = async (req, res) => {
    try {
        await Product.deleteMany({});
        res.json({ message: 'All products cleared successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error clearing products' });
    }
};
