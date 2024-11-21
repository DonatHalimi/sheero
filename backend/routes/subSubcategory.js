const express = require('express');
const { createSubSubcategory, getSubSubcategories, getSubSubcategoryById, getSubSubcategoriesBySubcategory, updateSubSubcategory, deleteSubSubcategory, deleteSubSubcategories } = require('../controllers/subSubcategoryController');
const { createSchema, getByIdSchema, updateSchema, deleteSchema, deleteBulkSchema } = require('../validations/subSubcategory');
const { requireAuthAndRole } = require('../middleware/auth');
const validate = require('../middleware/validation');

const router = express.Router();

router.post('/create', requireAuthAndRole('admin'), validate(createSchema), createSubSubcategory);
router.get('/get', getSubSubcategories);
router.get('/get/:id', validate(getByIdSchema), getSubSubcategoryById);
router.get('/get-by-subCategory/:subcategoryId', getSubSubcategoriesBySubcategory);
router.put('/update/:id', requireAuthAndRole('admin'), validate(updateSchema), updateSubSubcategory);
router.delete('/delete/:id', requireAuthAndRole('admin'), validate(deleteSchema), deleteSubSubcategory);
router.delete('/delete-bulk', requireAuthAndRole('admin'), validate(deleteBulkSchema), deleteSubSubcategories);

module.exports = router;