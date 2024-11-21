const express = require('express');
const { createCity, getCities, getCityById, updateCity, deleteCity, getCitiesByCountry, deleteCities } = require('../controllers/cityController');
const { requireAuth, requireAuthAndRole } = require('../middleware/auth.js');
const { createSchema, getByIdSchema, updateSchema, deleteSchema, deleteBulkSchema } = require('../validations/city');
const validate = require('../middleware/validation');

const router = express.Router();

router.post('/create', requireAuthAndRole('admin'), validate(createSchema), createCity);
router.get('/get', requireAuth, getCities);
router.get('/get/:id', requireAuth, validate(getByIdSchema), getCityById);
router.get('/country/:countryId', requireAuth, getCitiesByCountry);
router.put('/update/:id', requireAuthAndRole('admin'), validate(updateSchema), updateCity);
router.delete('/delete/:id', requireAuthAndRole('admin'), validate(deleteSchema), deleteCity);
router.delete('/delete-bulk', requireAuthAndRole('admin'), validate(deleteBulkSchema), deleteCities);

module.exports = router;