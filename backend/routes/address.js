const express = require('express');
const { createAddress, getAddresses, getAddress, getAddressByUser, updateAddress, deleteAddress, deleteAddresses } = require('../controllers/addressController');
const { protect, requireAuthAndRole } = require('../middleware/auth');
const { requireOwnershipOrAdmin } = require('../middleware/auth');
const Address = require('../models/Address');

const router = express.Router();

router.post('/create', protect, createAddress);
router.get('/get', requireAuthAndRole('admin'), getAddresses);
router.get('/get/:id', protect, requireOwnershipOrAdmin(Address), getAddress);
router.get('/user/:userId', protect, getAddressByUser);
router.put('/update/:id', protect, requireOwnershipOrAdmin(Address), updateAddress);
router.delete('/delete/:id', protect, requireOwnershipOrAdmin(Address), deleteAddress);
router.delete('/delete-bulk', requireAuthAndRole('admin'), deleteAddresses);

module.exports = router;