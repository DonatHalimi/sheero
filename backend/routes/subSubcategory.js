const express = require('express');
const router = express.Router();
const { createSubSubcategory, getSubSubcategories, getSubSubcategory, updateSubSubcategory, deleteSubSubcategory, deleteSubSubcategories } = require('../controllers/subSubcategoryController');
const { requireAuthAndRole } = require('../middleware/auth');

router.post('/create', requireAuthAndRole('admin'), createSubSubcategory);
router.get('/get', getSubSubcategories);
router.get('/get/:id', getSubSubcategory);
router.put('/update/:id', requireAuthAndRole('admin'), updateSubSubcategory);
router.delete('/delete/:id', requireAuthAndRole('admin'), deleteSubSubcategory);
router.delete('/delete-bulk', requireAuthAndRole('admin'), deleteSubSubcategories);

module.exports = router;