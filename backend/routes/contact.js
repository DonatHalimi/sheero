const express = require('express');
const { createContact, getContacts, deleteContact, deleteContacts } = require('../controllers/contactController');
const { requireAuthAndRole } = require('../middleware/auth.js');
const { createSchema, deleteSchema, deleteBulkSchema } = require('../validations/contact');
const validate = require('../middleware/validation');

const router = express.Router();

router.post('/create', validate(createSchema), createContact);
router.get('/get', requireAuthAndRole(['admin', 'customerSupport']), getContacts);
router.delete('/delete/:id', requireAuthAndRole(['admin', 'customerSupport']), validate(deleteSchema), deleteContact);
router.delete('/delete-bulk', requireAuthAndRole(['admin', 'customerSupport']), validate(deleteBulkSchema), deleteContacts)

module.exports = router;