const express = require('express');
const { createContact, getContacts, deleteContact, deleteContacts } = require('../controllers/contactController');
const { requireAuthAndRole } = require('../middleware/auth.js');
const router = express.Router();

router.post('/create', createContact);
router.get('/get', requireAuthAndRole('admin'), getContacts);
router.get('/delete', requireAuthAndRole('admin'), deleteContact);
router.delete('/delete-bulk', requireAuthAndRole('admin'), deleteContacts)

module.exports = router;