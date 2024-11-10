const express = require('express');
const { createCity, getCities, getCity, updateCity, deleteCity, getCitiesByCountry, deleteCities } = require('../controllers/cityController');
const { requireAuth, requireAuthAndRole } = require('../middleware/auth.js');
const router = express.Router();

router.post('/create', requireAuthAndRole('admin'), createCity);
router.get('/get', requireAuth, getCities);
router.get('/get/:id', requireAuth, getCity);
router.put('/update/:id', requireAuthAndRole('admin'), updateCity);
router.delete('/delete/:id', requireAuthAndRole('admin'), deleteCity);
router.get('/country/:countryId', requireAuth, getCitiesByCountry);
router.delete('/delete-bulk', requireAuthAndRole('admin'), deleteCities);

module.exports = router;