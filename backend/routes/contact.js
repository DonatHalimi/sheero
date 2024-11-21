const express = require('express');
const { createContact, getContacts, deleteContact, deleteContacts } = require('../controllers/contactController');
const { requireAuthAndRole, requireAuth } = require('../middleware/auth.js');
const { createSchema, deleteSchema, deleteBulkSchema } = require('../validations/contact');
const validate = require('../middleware/validation');

const router = express.Router();

router.post('/create', requireAuth, validate(createSchema), createContact);
router.get('/get', requireAuthAndRole('admin'), getContacts);
router.delete('/delete/:id', requireAuthAndRole('admin'), validate(deleteSchema), deleteContact);
router.delete('/delete-bulk', requireAuthAndRole('admin'), validate(deleteBulkSchema), deleteContacts)

module.exports = router;