const express = require('express');
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct, deleteProducts } = require('../controllers/productController');
const upload = require('../middleware/upload');
const { requireAuthAndRole } = require('../middleware/auth');

const router = express.Router();

router.post('/create', requireAuthAndRole('admin'), upload.single('image'), createProduct);
router.get('/get', getProducts);
router.get('/get/:id', getProduct);
router.put('/update/:id', requireAuthAndRole('admin'), upload.single('image'), updateProduct);
router.delete('/delete/:id', requireAuthAndRole('admin'), deleteProduct);
router.delete('/delete-bulk', requireAuthAndRole('admin'), deleteProducts);

module.exports = router;