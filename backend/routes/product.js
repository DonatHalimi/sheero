const express = require('express');
const { createProduct, getProducts, getProduct, getProductsByCategory,
    getProductsBySubCategory, getProductsBySubSubCategory, updateProduct,
    subscribeForRestock, getAllRestockSubscriptions, deleteRestockSubscriptions,
    deleteProduct, deleteProducts, searchProducts, createProductBasic, uploadProductImage, addProductVariantsAndDetails
} = require('../controllers/productController');

const upload = require('../middleware/upload');
const { requireAuthAndRole } = require('../middleware/auth');

const router = express.Router();

router.post('/create', requireAuthAndRole('admin'), upload.single('image'), createProduct);
router.get('/get', getProducts);
router.get('/get/:id', getProduct);
router.get('/get-by-category/:id', getProductsByCategory)
router.get('/get-by-subcategory/:id', getProductsBySubCategory)
router.get('/get-by-subSubcategory/:id', getProductsBySubSubCategory)
router.get('/search', searchProducts);
router.put('/update/:id', requireAuthAndRole('admin'), upload.single('image'), updateProduct);
router.post('/:productId/subscribe-restock', subscribeForRestock);
router.get('/restock-subscriptions', requireAuthAndRole('admin'), getAllRestockSubscriptions);
router.delete('/subscriptions/delete-bulk', requireAuthAndRole('admin'), deleteRestockSubscriptions);
router.delete('/delete/:id', requireAuthAndRole('admin'), deleteProduct);
router.delete('/delete-bulk', requireAuthAndRole('admin'), deleteProducts);

// routes for 'AddProductModal' product addition!
router.post('/create-basic', requireAuthAndRole('admin'), createProductBasic);
router.post('/upload-image', requireAuthAndRole('admin'), upload.single('image'), uploadProductImage);
router.post('/add-variants', requireAuthAndRole('admin'), addProductVariantsAndDetails);

module.exports = router;