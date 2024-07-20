const express = require('express');
const { createCountry, getCountries, getCountry, updateCountry, deleteCountry } = require('../controllers/countryController');
const { requireAuthAndRole } = require('../middleware/auth');

const router = express.Router();

router.post('/create', requireAuthAndRole('admin'), createCountry);
router.get('/get', getCountries);
router.get('/get/:id', getCountry);
router.put('/update/:id', requireAuthAndRole('admin'), updateCountry);
router.delete('/delete/:id', requireAuthAndRole('admin'), deleteCountry);

module.exports = router;
