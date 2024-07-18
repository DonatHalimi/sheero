const express = require('express');
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const upload = require('../middleware/upload');
const { protect, authorizeRole } = require('../middleware/auth');

const router = express.Router();

router.post('/create', protect, authorizeRole('admin'), upload.single('image'), createProduct);
router.get('/get', getProducts);
router.get('/get/:id', getProduct);
router.put('/update/:id', protect, authorizeRole('admin'), upload.single('image'), updateProduct);
router.delete('/delete/:id', protect, authorizeRole('admin'), deleteProduct);

module.exports = router;