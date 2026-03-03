const express = require('express');
const { signup, login, getProfile, updateProfile, getAllUsers, changePassword } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/users', protect, admin, getAllUsers);
router.put('/change-password', protect, changePassword);

module.exports = router;
