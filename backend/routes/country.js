const express = require('express');
const { createCountry, getCountries, getCountry, updateCountry, deleteCountry, deleteCountries } = require('../controllers/countryController');
const { requireAuthAndRole, requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/create', requireAuthAndRole('admin'), createCountry);
router.get('/get', requireAuth, getCountries);
router.get('/get/:id', requireAuth, getCountry);
router.put('/update/:id', requireAuthAndRole('admin'), updateCountry);
router.delete('/delete/:id', requireAuthAndRole('admin'), deleteCountry);
router.delete('/delete-bulk', requireAuthAndRole('admin'), deleteCountries);

module.exports = router;
