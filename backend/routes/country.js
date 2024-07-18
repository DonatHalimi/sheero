const express = require('express');
const { createCountry, getCountries, getCountry, updateCountry, deleteCountry } = require('../controllers/countryController');
const { protect, authorizeRole } = require('../middleware/auth');

const router = express.Router();

router.post('/create', protect, authorizeRole('admin'), createCountry);
router.get('/get', getCountries);
router.get('/get/:id', getCountry);
router.put('/update/:id', protect, authorizeRole('admin'), updateCountry);
router.delete('/delete/:id', protect, authorizeRole('admin'), deleteCountry);

module.exports = router;
