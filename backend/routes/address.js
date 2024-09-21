const express = require('express');
const { createAddress, getAddresses, getAddress, getAddressByUser, updateAddress, deleteAddress, deleteAddresses } = require('../controllers/addressController');
const { protect, requireAuthAndRole } = require('../middleware/auth');

const router = express.Router();

router.post('/create', protect, createAddress);
router.get('/get', requireAuthAndRole('admin'), getAddresses);
router.get('/get/:id', protect, getAddress);
router.get('/user/:userId', protect, getAddressByUser);
router.put('/update/:id', protect, updateAddress);
router.delete('/delete/:id', protect, deleteAddress);
router.delete('/delete-bulk', requireAuthAndRole('admin'), deleteAddresses);

module.exports = router;