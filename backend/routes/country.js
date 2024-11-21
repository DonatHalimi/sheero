const express = require('express');
const { createCountry, getCountries, getCountryById, updateCountry, deleteCountry, deleteCountries } = require('../controllers/countryController');
const { requireAuthAndRole, requireAuth } = require('../middleware/auth');
const { createSchema, getByIdSchema, updateSchema, deleteSchema, deleteBulkSchema } = require('../validations/country');
const validate = require('../middleware/validation');

const router = express.Router();

router.post('/create', requireAuthAndRole('admin'), validate(createSchema), createCountry);
router.get('/get', requireAuth, getCountries);
router.get('/get/:id', requireAuth, validate(getByIdSchema), getCountryById);
router.put('/update/:id', requireAuthAndRole('admin'), validate(updateSchema), updateCountry);
router.delete('/delete/:id', requireAuthAndRole('admin'), validate(deleteSchema), deleteCountry);
router.delete('/delete-bulk', requireAuthAndRole('admin'), validate(deleteBulkSchema), deleteCountries);

module.exports = router;
