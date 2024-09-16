const express = require('express');
const { createContact, getContacts } = require('../controllers/contactController');
const { requireAuthAndRole } = require('../middleware/auth.js');
const router = express.Router();

router.post('/create', createContact);
router.get('/get', requireAuthAndRole('admin'), getContacts);

module.exports = router;