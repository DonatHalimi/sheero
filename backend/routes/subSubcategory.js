const express = require('express');
const { createSubSubcategory, getSubSubcategories, getSubSubcategoryBySlug, getSubSubcategoriesBySubcategory, updateSubSubcategory, deleteSubSubcategory, deleteSubSubcategories } = require('../controllers/subSubcategoryController');
const { createSchema, getByIdSchema, updateSchema, deleteSchema, deleteBulkSchema } = require('../validations/subSubcategory');
const { requireAuthAndRole } = require('../middleware/auth');
const validate = require('../middleware/validation');

const router = express.Router();

router.post('/create', requireAuthAndRole(['admin', 'productManager']), validate(createSchema), createSubSubcategory);
router.get('/get', getSubSubcategories);
router.get('/get-by-slug/:slug', getSubSubcategoryBySlug);
router.get('/get-by-subcategory/:slug', getSubSubcategoriesBySubcategory);
router.put('/update/:id', requireAuthAndRole(['admin', 'productManager']), validate(updateSchema), updateSubSubcategory);
router.delete('/delete/:id', requireAuthAndRole(['admin', 'productManager']), validate(deleteSchema), deleteSubSubcategory);
router.delete('/delete-bulk', requireAuthAndRole(['admin', 'productManager']), validate(deleteBulkSchema), deleteSubSubcategories);

module.exports = router;