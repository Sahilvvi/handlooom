const express = require('express');
const { signup, login, getProfile, updateProfile, getAllUsers, changePassword, createUser, updateUserRole } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/users', protect, admin, getAllUsers);
router.post('/users', protect, admin, createUser);
router.put('/users/:id/role', protect, admin, updateUserRole);
router.put('/change-password', protect, changePassword);

module.exports = router;
