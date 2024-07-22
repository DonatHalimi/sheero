const express = require('express');
const { createAddress, getAddresses, getAddress, updateAddress, deleteAddress, deleteAddresses } = require('../controllers/addressController');
const { protect, requireAuthAndRole, authorizeRole } = require('../middleware/auth');

const router = express.Router();

router.post('/create', protect, createAddress);
router.get('/get', requireAuthAndRole('admin'), getAddresses);
router.get('/get/:id', protect, getAddress);
router.put('/update/:id', protect, updateAddress);
router.delete('/delete/:id', protect, deleteAddress);
router.delete('/delete-bulk', requireAuthAndRole('admin'), deleteAddresses)

module.exports = router;