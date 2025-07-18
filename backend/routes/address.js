const express = require('express');
const { createAddress, getAddresses, getAddress, getUserAddress, updateAddress, deleteAddress, deleteAddresses } = require('../controllers/addressController');
const { requireAuth, requireAuthAndRole, requireOwnershipOrAdmin } = require('../middleware/auth');
const { createSchema, getByIdSchema, getUserAddressSchema, updateSchema, deleteSchema, deleteBulkSchema } = require('../validations/address');
const Address = require('../models/Address');
const validate = require('../middleware/validation');

const router = express.Router();

router.post('/create', requireAuth, validate(createSchema), createAddress);
router.get('/get', requireAuthAndRole('admin'), getAddresses);
router.get('/get/:id', requireAuth, validate(getByIdSchema), getAddress);
router.get('/user/:userId', requireAuth, validate(getUserAddressSchema), getUserAddress);
router.put('/update/:id', requireAuth, validate(updateSchema), updateAddress);
router.delete('/delete/:id', requireAuth, validate(deleteSchema), requireOwnershipOrAdmin(Address), deleteAddress);
router.delete('/delete-bulk', requireAuthAndRole('admin'), validate(deleteBulkSchema), deleteAddresses);

module.exports = router;