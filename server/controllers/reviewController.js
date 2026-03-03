const Review = require('../models/Review');

// GET /api/reviews/:productId
exports.getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId, isApproved: true })
            .sort({ createdAt: -1 });
        const avg = reviews.length
            ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
            : 0;
        res.json({ reviews, avgRating: avg, count: reviews.length });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/reviews (auth required)
exports.createReview = async (req, res) => {
    try {
        const { productId, name, rating, review } = req.body;
        if (!productId || !name || !rating || !review) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const newReview = new Review({
            product: productId,
            user: req.user?.id || null,
            name,
            rating: Number(rating),
            review
        });
        await newReview.save();
        res.status(201).json(newReview);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Admin: GET all reviews
exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find().populate('product', 'name').sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Admin: toggle approve
exports.toggleApprove = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ message: 'Review not found' });
        review.isApproved = !review.isApproved;
        await review.save();
        res.json(review);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Admin: delete review
exports.deleteReview = async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.json({ message: 'Review deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
