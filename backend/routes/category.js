const express = require('express');
const { createCategory, getCategories, getCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const upload = require('../middleware/upload');
const { protect, authorizeRole } = require('../middleware/auth');

const router = express.Router();

router.post('/create', protect, authorizeRole('admin'), upload.single('image'), createCategory);
router.get('/get', getCategories);
router.get('/get/:id', getCategory);
router.put('/update/:id', protect, authorizeRole('admin'), upload.single('image'), updateCategory);
router.delete('/delete/:id', protect, authorizeRole('admin'), deleteCategory);

module.exports = router;