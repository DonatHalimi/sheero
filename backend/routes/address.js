const express = require('express');
const { createAddress, getAddresses, getAddress, getAddressByUser, updateAddress, deleteAddress, deleteAddresses } = require('../controllers/addressController');
const { requireAuth, requireAuthAndRole } = require('../middleware/auth');
const { requireOwnershipOrAdmin } = require('../middleware/auth');
const Address = require('../models/Address');

const router = express.Router();

router.post('/create', requireAuth, createAddress);
router.get('/get', requireAuthAndRole('admin'), getAddresses);
router.get('/get/:id', requireAuth, requireOwnershipOrAdmin(Address), getAddress);
router.get('/user/:userId', requireAuth, getAddressByUser);
router.put('/update/:id', requireAuth, requireOwnershipOrAdmin(Address), updateAddress);
router.delete('/delete/:id', requireAuth, requireOwnershipOrAdmin(Address), deleteAddress);
router.delete('/delete-bulk', requireAuthAndRole('admin'), deleteAddresses);

module.exports = router;