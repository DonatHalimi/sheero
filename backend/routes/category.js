const express = require('express');
const { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory, deleteCategories } = require('../controllers/categoryController');
const { createSchema, getByIdSchema, updateSchema, deleteSchema, deleteBulkSchema } = require('../validations/category');
const { requireAuthAndRole } = require('../middleware/auth');
const upload = require('../middleware/upload');
const validate = require('../middleware/validation');

const router = express.Router();

router.post('/create', requireAuthAndRole('admin'), upload.single('image'), validate(createSchema), createCategory);
router.get('/get', getCategories);
router.get('/get/:id', validate(getByIdSchema), getCategoryById);
router.put('/update/:id', requireAuthAndRole('admin'), upload.single('image'), validate(updateSchema), updateCategory);
router.delete('/delete/:id', requireAuthAndRole('admin'), validate(deleteSchema), deleteCategory);
router.delete('/delete-bulk', requireAuthAndRole('admin'), validate(deleteBulkSchema), deleteCategories);

module.exports = router;