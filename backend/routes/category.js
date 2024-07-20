const express = require('express');
const { createCategory, getCategories, getCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const upload = require('../middleware/upload');
const { requireAuthAndRole } = require('../middleware/auth');

const router = express.Router();

router.post('/create', requireAuthAndRole('admin'), upload.single('image'), createCategory);
router.get('/get', getCategories);
router.get('/get/:id', getCategory);
router.put('/update/:id', requireAuthAndRole('admin'), upload.single('image'), updateCategory);
router.delete('/delete/:id', requireAuthAndRole('admin'), deleteCategory);

module.exports = router;