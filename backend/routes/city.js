const express = require('express');
const { createCity, getCities, getCity, updateCity, deleteCity, getCitiesByCountry } = require('../controllers/cityController');
const { protect, authorizeRole } = require('../middleware/auth.js');
const router = express.Router();

router.post('/create', protect, authorizeRole('admin'), createCity);
router.get('/get', getCities);
router.get('/get/:id', getCity);
router.put('/update/:id', protect, authorizeRole('admin'), updateCity);
router.delete('/delete/:id', protect, authorizeRole('admin'), deleteCity);
router.get('/country/:countryId', protect, getCitiesByCountry);

module.exports = router;
