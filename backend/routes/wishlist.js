const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getWishlist, getWishlistByUserId, addToWishlist, removeFromWishlist, clearWishlist } = require('../controllers/wishlistController');

router.get('/', protect, getWishlist);
router.get('/:userId', protect, getWishlistByUserId);
router.post('/add', protect, addToWishlist);
router.delete('/remove', protect, removeFromWishlist);
router.delete('/clear', protect, clearWishlist);

module.exports = router;