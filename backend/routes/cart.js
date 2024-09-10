const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItemQuantity, removeFromCart, clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getCart);
router.post('/add', protect, addToCart);
router.put('/update-quantity', protect, updateCartItemQuantity);
router.delete('/remove', protect, removeFromCart);
router.delete('/clear', protect, clearCart);

module.exports = router;