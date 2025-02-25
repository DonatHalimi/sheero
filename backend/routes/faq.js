const express = require('express');
const { createFAQ, getFAQs, getFAQ, updateFAQ, deleteFAQ, deleteFAQs } = require('../controllers/faqController');
const { requireAuthAndRole } = require('../middleware/auth');
const { createSchema, getByIdSchema, updateSchema, deleteSchema, deleteBulkSchema } = require('../validations/faq');
const validate = require('../middleware/validation');

const router = express.Router();

router.post('/create', requireAuthAndRole(['admin', 'contentManager']), validate(createSchema), createFAQ);
router.get('/get', getFAQs);
router.get('/get/:id', validate(getByIdSchema), getFAQ);
router.put('/update/:id', requireAuthAndRole(['admin', 'contentManager']), validate(updateSchema), updateFAQ);
router.delete('/delete/:id', requireAuthAndRole(['admin', 'contentManager']), validate(deleteSchema), deleteFAQ);
router.delete('/delete-bulk', requireAuthAndRole(['admin', 'contentManager']), validate(deleteBulkSchema), deleteFAQs);

module.exports = router;