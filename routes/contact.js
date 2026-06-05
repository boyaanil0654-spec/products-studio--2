routes/contact.js
const express = require('express');
const router = express.Router();
const { submitContact, signup, getContacts } = require('../controllers/contactController');
const { protect } = require('../middleware/auth');

router.post('/contact', submitContact);
router.post('/signup', signup);
router.get('/contacts', protect, getContacts);

module.exports = router;
