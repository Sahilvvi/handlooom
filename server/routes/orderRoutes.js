const express = require('express');
const {
    createOrder, getAllOrders, getMyOrders,
    getOrderById, updateOrderStatus, getDashboardStats, trackOrder
} = require('../controllers/orderController');

const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', createOrder);                           // Create order (public)
router.get('/my-orders', protect, getMyOrders);          // Get own orders (logged-in user)
router.get('/dashboard-stats', protect, admin, getDashboardStats); // Admin stats
router.get('/', protect, admin, getAllOrders);            // All orders (admin)
router.get('/track/:orderNumber', trackOrder);            // Public: track order by order number
router.get('/:id', protect, getOrderById);               // Single order by ID
router.put('/:id/status', protect, admin, updateOrderStatus); // Update status (admin)

module.exports = router;
