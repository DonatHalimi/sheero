const express = require('express');
const { createSupplier, getSuppliers, getSupplier, updateSupplier, deleteSupplier, deleteSuppliers } = require('../controllers/supplierController');
const { requireAuthAndRole, protect } = require('../middleware/auth');

const router = express.Router();

router.post('/create', requireAuthAndRole('admin'), createSupplier);
router.get('/get', requireAuthAndRole('admin'), getSuppliers);
router.get('/get/:id', requireAuthAndRole('admin'), getSupplier);
router.put('/update/:id', requireAuthAndRole('admin'), updateSupplier);
router.delete('/delete/:id', requireAuthAndRole('admin'), deleteSupplier);
router.delete('/delete-bulk', requireAuthAndRole('admin'), deleteSuppliers)

module.exports = router;