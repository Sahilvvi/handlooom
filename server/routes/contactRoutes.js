const express = require('express');
const { submitContact, getAllContacts, markRead } = require('../controllers/contactController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', submitContact);                         // Public: submit form
router.get('/', protect, admin, getAllContacts);          // Admin: view all messages
router.put('/:id/read', protect, admin, markRead);       // Admin: mark as read

module.exports = router;
