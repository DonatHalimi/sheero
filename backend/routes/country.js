const express = require('express');
const { createCountry, getCountries, getCountry, updateCountry, deleteCountry, deleteCountries } = require('../controllers/countryController');
const { requireAuthAndRole, protect } = require('../middleware/auth');

const router = express.Router();

router.post('/create', requireAuthAndRole('admin'), createCountry);
router.get('/get', protect, getCountries);
router.get('/get/:id', protect, getCountry);
router.put('/update/:id', requireAuthAndRole('admin'), updateCountry);
router.delete('/delete/:id', requireAuthAndRole('admin'), deleteCountry);
router.delete('/delete-bulk', requireAuthAndRole('admin'), deleteCountries);

module.exports = router;
