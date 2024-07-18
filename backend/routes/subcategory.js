const express = require('express');
const { createSubcategory, getSubcategories, getSubcategory, updateSubcategory, deleteSubcategory } = require('../controllers/subcategoryController');
const router = express.Router();
const { protect, authorizeRole } = require('../middleware/auth');

router.post('/create', protect, authorizeRole('admin'), createSubcategory);
router.get('/get', getSubcategories);
router.get('/get/:id', getSubcategory);
router.put('/update/:id', protect, authorizeRole('admin'), updateSubcategory);
router.delete('/delete/:id', protect, authorizeRole('admin'), deleteSubcategory);

module.exports = router;
