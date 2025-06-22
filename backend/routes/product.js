const express = require('express');
const {
    createProduct, getProducts, getProductsPaginated, getProductBySlug, updateProduct, getProductsByCategory, getProductsBySubCategory,
    getProductsBySubSubCategory, deleteProduct, deleteProducts, searchProducts, createProductBasic, uploadProductImage, addProductVariantsAndDetails
} = require('../controllers/productController');
const { subscribeForRestock, getUserRestockSubscription, deleteUserRestockSubscription, getAllRestockSubscriptions,
    deleteRestockSubscription, deleteRestockSubscriptions
} = require('../controllers/restockSubController');
const upload = require('../middleware/upload');
const { requireAuthAndRole, requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/create', requireAuthAndRole(['admin', 'productManager']), upload.single('image'), createProduct);
router.get('/get', getProducts);
router.get('/get/paginated', getProductsPaginated);
router.get('/get-by-slug/:slug', getProductBySlug);
router.get('/get-by-category/:id', getProductsByCategory)
router.get('/get-by-subcategory/:slug', getProductsBySubCategory);
router.get('/get-by-subSubcategory/:slug', getProductsBySubSubCategory);
router.get('/search', searchProducts);
router.put('/update/:id', requireAuthAndRole(['admin', 'productManager']), upload.single('image'), updateProduct);
router.post('/:productId/subscribe-restock', subscribeForRestock);
router.get('/restock-subscription', requireAuth, getUserRestockSubscription);
router.delete('/delete-restock-subscription', requireAuth, deleteUserRestockSubscription);
router.get('/restock-subscriptions', requireAuthAndRole(['admin', 'productManager']), getAllRestockSubscriptions);
router.delete('/subscriptions/delete/:id', requireAuthAndRole(['admin', 'productManager']), deleteRestockSubscription);
router.delete('/subscriptions/delete-bulk', requireAuthAndRole(['admin', 'productManager']), deleteRestockSubscriptions);
router.delete('/delete/:id', requireAuthAndRole(['admin', 'productManager']), deleteProduct);
router.delete('/delete-bulk', requireAuthAndRole(['admin', 'productManager']), deleteProducts);

// routes for 'AddProductModal' product addition!
router.post('/create-basic', requireAuthAndRole(['admin', 'productManager']), createProductBasic);
router.post('/upload-image', requireAuthAndRole(['admin', 'productManager']), upload.single('image'), uploadProductImage);
router.post('/add-variants', requireAuthAndRole(['admin', 'productManager']), addProductVariantsAndDetails);

module.exports = router;