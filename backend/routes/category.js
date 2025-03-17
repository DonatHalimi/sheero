const express = require('express');
const { createCategory, getCategories, getCategoryBySlug, updateCategory, deleteCategory, deleteCategories } = require('../controllers/categoryController');
const { createSchema, updateSchema, deleteSchema, deleteBulkSchema } = require('../validations/category');
const { requireAuthAndRole } = require('../middleware/auth');
const upload = require('../middleware/upload');
const validate = require('../middleware/validation');

const router = express.Router();

router.post('/create', requireAuthAndRole(['admin', 'productManager']), upload.single('image'), validate(createSchema), createCategory);
router.get('/get', getCategories);
router.get('/get-by-slug/:slug', getCategoryBySlug);    
router.put('/update/:id', requireAuthAndRole(['admin', 'productManager']), upload.single('image'), validate(updateSchema), updateCategory);
router.delete('/delete/:id', requireAuthAndRole(['admin', 'productManager']), validate(deleteSchema), deleteCategory);
router.delete('/delete-bulk', requireAuthAndRole(['admin', 'productManager']), validate(deleteBulkSchema), deleteCategories);

module.exports = router;