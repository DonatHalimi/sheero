const express = require('express');
const { createSubcategory, getSubcategories, getSubcategoryBySlug, getSubcategoriesByCategory, updateSubcategory, deleteSubcategory, deleteSubcategories } = require('../controllers/subcategoryController');
const { createSchema, getByIdSchema, updateSchema, deleteSchema, deleteBulkSchema } = require('../validations/subcategory');
const { requireAuthAndRole } = require('../middleware/auth');
const upload = require('../middleware/upload');
const validate = require('../middleware/validation');

const router = express.Router();

router.post('/create', requireAuthAndRole(['admin', 'productManager']), upload.single('image'), validate(createSchema), createSubcategory);
router.get('/get', getSubcategories);
router.get('/get-by-slug/:slug', getSubcategoryBySlug);
router.get('/get-by-category/:slug', getSubcategoriesByCategory);
router.put('/update/:id', requireAuthAndRole(['admin', 'productManager']), upload.single('image'), validate(updateSchema), updateSubcategory);
router.delete('/delete/:id', requireAuthAndRole(['admin', 'productManager']), validate(deleteSchema), deleteSubcategory);
router.delete('/delete-bulk', requireAuthAndRole(['admin', 'productManager']), validate(deleteBulkSchema), deleteSubcategories)

module.exports = router;