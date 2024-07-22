const express = require('express');
const { createSubcategory, getSubcategories, getSubcategory, updateSubcategory, deleteSubcategory, deleteSubcategories } = require('../controllers/subcategoryController');
const router = express.Router();
const { requireAuthAndRole } = require('../middleware/auth');

router.post('/create', requireAuthAndRole('admin'), createSubcategory);
router.get('/get', getSubcategories);
router.get('/get/:id', getSubcategory);
router.put('/update/:id', requireAuthAndRole('admin'), updateSubcategory);
router.delete('/delete/:id', requireAuthAndRole('admin'), deleteSubcategory);
router.delete('/delete-bulk', requireAuthAndRole('admin'), deleteSubcategories)

module.exports = router;
