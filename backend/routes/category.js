const express = require('express');
const { createCategory, getCategories, getCategory, updateCategory, deleteCategory, deleteCategories } = require('../controllers/categoryController');
const upload = require('../middleware/upload');
const { requireAuthAndRole } = require('../middleware/auth');

const router = express.Router();

router.post('/create', requireAuthAndRole('admin'), upload.single('image'), createCategory);
router.get('/get', getCategories);
router.get('/get/:id', getCategory);
router.put('/update/:id', requireAuthAndRole('admin'), upload.single('image'), updateCategory);
router.delete('/delete/:id', requireAuthAndRole('admin'), deleteCategory);
router.delete('/delete-bulk', requireAuthAndRole('admin'), deleteCategories);

module.exports = router;