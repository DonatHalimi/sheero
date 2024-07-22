const express = require('express');
const { createCity, getCities, getCity, updateCity, deleteCity, getCitiesByCountry, deleteCities } = require('../controllers/cityController');
const { protect, requireAuthAndRole } = require('../middleware/auth.js');
const router = express.Router();

router.post('/create', requireAuthAndRole('admin'), createCity);
router.get('/get', getCities);
router.get('/get/:id', getCity);
router.put('/update/:id', requireAuthAndRole('admin'), updateCity);
router.delete('/delete/:id', requireAuthAndRole('admin'), deleteCity);
router.get('/country/:countryId', protect, getCitiesByCountry);
router.delete('/delete-bulk', requireAuthAndRole('admin'), deleteCities);

module.exports = router;
