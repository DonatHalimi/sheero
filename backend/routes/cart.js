const express = require('express');
const router = express.Router();
const { addToCart, bulkAddToCart, getCartByUser, getAllCarts, updateCartItemQuantity, removeFromCart, clearCart } = require('../controllers/cartController');
const { addSchema, updateSchema, removeSchema } = require('../validations/cart');
const { requireAuth } = require('../middleware/auth');
const validate = require('../middleware/validation');

router.post('/add', requireAuth, validate(addSchema), addToCart);
router.post('/bulk-add', requireAuth, bulkAddToCart);
router.get('/', requireAuth, getCartByUser);
router.get('/get', requireAuth, getAllCarts);
router.put('/quantity/update', requireAuth, validate(updateSchema), updateCartItemQuantity);
router.delete('/remove', requireAuth, validate(removeSchema), removeFromCart);
router.delete('/clear', requireAuth, clearCart);

module.exports = router;