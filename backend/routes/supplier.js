const express = require('express');
const { createSupplier, getSuppliers, getSupplierById, updateSupplier, deleteSupplier, deleteSuppliers } = require('../controllers/supplierController');
const { createSchema, getByIdSchema, updateSchema, deleteSchema, deleteBulkSchema } = require('../validations/supplier');
const { requireAuthAndRole } = require('../middleware/auth');
const validate = require('../middleware/validation');

const router = express.Router();

router.post('/create', requireAuthAndRole('admin'), validate(createSchema), createSupplier);
router.get('/get', requireAuthAndRole('admin'), getSuppliers);
router.get('/get/:id', requireAuthAndRole('admin'), validate(getByIdSchema), getSupplierById);
router.put('/update/:id', requireAuthAndRole('admin'), validate(updateSchema), updateSupplier);
router.delete('/delete/:id', requireAuthAndRole('admin'), validate(deleteSchema), deleteSupplier);
router.delete('/delete-bulk', requireAuthAndRole('admin'), validate(deleteBulkSchema), deleteSuppliers)

module.exports = router;