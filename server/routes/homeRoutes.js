const express = require('express');
const router = express.Router();
const { getHomeSettings, updateHomeSettings } = require('../controllers/homeController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getHomeSettings);
router.put('/', protect, admin, updateHomeSettings);

module.exports = router;
