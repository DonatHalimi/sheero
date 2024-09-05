const express = require('express');
const { createFAQ, getFAQs, getFAQ, updateFAQ, deleteFAQ, deleteFAQs } = require('../controllers/faqController');
const { requireAuthAndRole } = require('../middleware/auth');
const router = express.Router();

router.post('/create', requireAuthAndRole('admin'), createFAQ);
router.get('/get', getFAQs);
router.get('/get/:id', getFAQ);
router.put('/update/:id', requireAuthAndRole('admin'), updateFAQ);
router.delete('/delete/:id', requireAuthAndRole('admin'), deleteFAQ);
router.delete('/delete-bulk', requireAuthAndRole('admin'), deleteFAQs);

module.exports = router;