const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { getWishlist, getWishlistByUserId, addToWishlist, removeFromWishlist, clearWishlist } = require('../controllers/wishlistController');
const { addSchema, removeSchema, clearSchema } = require('../validations/wishlist');
const validate = require('../middleware/validation');

const router = express.Router();

router.get('/', requireAuth, getWishlist);
router.get('/:userId', getWishlistByUserId);
router.post('/add', requireAuth, validate(addSchema), addToWishlist);
router.delete('/remove', requireAuth, validate(removeSchema), removeFromWishlist);
router.delete('/clear', requireAuth, validate(clearSchema), clearWishlist);

module.exports = router;