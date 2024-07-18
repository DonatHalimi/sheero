const express = require('express');
const { createAddress, getAddresses, getAddress, updateAddress, deleteAddress } = require('../controllers/addressController');
const { protect, authorizeRole } = require('../middleware/auth');

const router = express.Router();

router.post('/create', protect, createAddress);
router.get('/get', protect, authorizeRole('admin'), getAddresses);
router.get('/get/:id', protect, getAddress);
router.put('/update/:id', protect, updateAddress);
router.delete('/delete/:id', protect, deleteAddress);

module.exports = router;