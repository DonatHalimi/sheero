const express = require('express');
const { createSubcategory, getSubcategories, getSubcategory, getSubcategoriesByCategory, updateSubcategory, deleteSubcategory, deleteSubcategories } = require('../controllers/subcategoryController');
const upload = require('../middleware/upload');
const { requireAuthAndRole } = require('../middleware/auth');

const router = express.Router();

router.post('/create', requireAuthAndRole('admin'), upload.single('image'), createSubcategory);
router.get('/get', getSubcategories);
router.get('/get/:id', getSubcategory);
router.get('/getByCategory/:categoryId', getSubcategoriesByCategory);
router.put('/update/:id', requireAuthAndRole('admin'), upload.single('image'), updateSubcategory);
router.delete('/delete/:id', requireAuthAndRole('admin'), deleteSubcategory);
router.delete('/delete-bulk', requireAuthAndRole('admin'), deleteSubcategories)

module.exports = router;