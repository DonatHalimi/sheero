const express = require('express');
const { createSupplier, getSuppliers, getSupplierById, updateSupplier, deleteSupplier, deleteSuppliers } = require('../controllers/supplierController');
const { createSchema, getByIdSchema, updateSchema, deleteSchema, deleteBulkSchema } = require('../validations/supplier');
const { requireAuthAndRole } = require('../middleware/auth');
const validate = require('../middleware/validation');

const router = express.Router();

router.post('/create', requireAuthAndRole(['admin', 'productManager']), validate(createSchema), createSupplier);
router.get('/get', requireAuthAndRole(['admin', 'productManager', 'orderManager']), getSuppliers);
router.get('/get/:id', requireAuthAndRole(['admin', 'productManager']), validate(getByIdSchema), getSupplierById);
router.put('/update/:id', requireAuthAndRole(['admin', 'productManager']), validate(updateSchema), updateSupplier);
router.delete('/delete/:id', requireAuthAndRole(['admin', 'productManager']), validate(deleteSchema), deleteSupplier);
router.delete('/delete-bulk', requireAuthAndRole(['admin', 'productManager']), validate(deleteBulkSchema), deleteSuppliers)

module.exports = router;