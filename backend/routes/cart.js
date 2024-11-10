const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItemQuantity, removeFromCart, clearCart } = require('../controllers/cartController');
const { requireAuth } = require('../middleware/auth');

router.get('/', requireAuth, getCart);
router.post('/add', requireAuth, addToCart);
router.put('/quantity/update', requireAuth, updateCartItemQuantity);
router.delete('/remove', requireAuth, removeFromCart);
router.delete('/clear', requireAuth, clearCart);

module.exports = router;