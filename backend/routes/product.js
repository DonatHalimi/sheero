const express = require('express');
const { createProduct, getProducts, getProduct, getProductsByCategory,
    getProductsBySubCategory, getProductsBySubSubCategory, updateProduct,
    subscribeForRestock, getAllRestockSubscriptions, deleteRestockSubscriptions,
    deleteProduct, deleteProducts, searchProducts, createProductBasic, uploadProductImage, addProductVariantsAndDetails
} = require('../controllers/productController');

const upload = require('../middleware/upload');
const { requireAuthAndRole } = require('../middleware/auth');

const router = express.Router();

router.post('/create', requireAuthAndRole(['admin', 'productManager']), upload.single('image'), createProduct);
router.get('/get', getProducts);
router.get('/get/:id', getProduct);
router.get('/get-by-category/:id', getProductsByCategory)
router.get('/get-by-subcategory/:id', getProductsBySubCategory)
router.get('/get-by-subSubcategory/:id', getProductsBySubSubCategory)
router.get('/search', searchProducts);
router.put('/update/:id', requireAuthAndRole(['admin', 'productManager']), upload.single('image'), updateProduct);
router.post('/:productId/subscribe-restock', subscribeForRestock);
router.get('/restock-subscriptions', requireAuthAndRole(['admin', 'productManager']), getAllRestockSubscriptions);
router.delete('/subscriptions/delete-bulk', requireAuthAndRole(['admin', 'productManager']), deleteRestockSubscriptions);
router.delete('/delete/:id', requireAuthAndRole(['admin', 'productManager']), deleteProduct);
router.delete('/delete-bulk', requireAuthAndRole(['admin', 'productManager']), deleteProducts);

// routes for 'AddProductModal' product addition!
router.post('/create-basic', requireAuthAndRole(['admin', 'productManager']), createProductBasic);
router.post('/upload-image', requireAuthAndRole(['admin', 'productManager']), upload.single('image'), uploadProductImage);
router.post('/add-variants', requireAuthAndRole(['admin', 'productManager']), addProductVariantsAndDetails);

module.exports = router;