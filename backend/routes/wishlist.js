const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { getWishlist, getWishlistByUserId, addToWishlist, removeFromWishlist, clearWishlist } = require('../controllers/wishlistController');

router.get('/', requireAuth, getWishlist);
router.get('/:userId', getWishlistByUserId);
router.post('/add', requireAuth, addToWishlist);
router.delete('/remove', requireAuth, removeFromWishlist);
router.delete('/clear', requireAuth, clearWishlist);

module.exports = router;