const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getWishlist, addToWishlist, removeFromWishlist, clearWishlist } = require('../controllers/wishlistController');

router.get('/', protect, getWishlist);
router.post('/add', protect, addToWishlist);
router.delete('/remove', protect, removeFromWishlist);
router.delete('/clear', protect, clearWishlist);

module.exports = router;