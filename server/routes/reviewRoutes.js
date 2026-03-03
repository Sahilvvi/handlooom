const express = require('express');
const { getProductReviews, createReview, getAllReviews, toggleApprove, deleteReview } = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/product/:productId', getProductReviews);   // Public: get reviews for a product
router.post('/', protect, createReview);                  // Logged-in: submit review
router.get('/', protect, admin, getAllReviews);           // Admin: all reviews
router.put('/:id/approve', protect, admin, toggleApprove); // Admin: approve/unapprove
router.delete('/:id', protect, admin, deleteReview);     // Admin: delete

module.exports = router;
