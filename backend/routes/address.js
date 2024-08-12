const express = require('express');
const { createAddress, getAddresses, getAddress, getUserAddress, updateAddress, deleteAddress, deleteAddresses } = require('../controllers/addressController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/create', protect, createAddress);
router.get('/get', protect, getAddresses);
router.get('/get/:id', protect, getAddress);
router.get('/user', protect, getUserAddress);
router.put('/update/:id', protect, updateAddress);
router.delete('/delete/:id', protect, deleteAddress);
router.delete('/delete-bulk', protect, deleteAddresses);

module.exports = router;