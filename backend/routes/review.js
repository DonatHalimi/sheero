const express = require('express');
const { checkReviewEligibility, createReview, getReviews, getReview, getReviewsByProduct, updateReview, deleteReview, getAllProducts, deleteReviews, getReviewsByUser } = require('../controllers/reviewController');
const { requireAuth, requireAuthAndRole, requireOwnershipOrAdmin } = require('../middleware/auth');
const Review = require('../models/Review');

const router = express.Router();

router.get('/orders/check-review/:productId', requireAuth, checkReviewEligibility);
router.post('/product/:productId', requireAuth, createReview);
router.get('/get', requireAuthAndRole('admin'), getReviews);
router.get('/get/:id', requireAuthAndRole('admin'), getReview);
router.get('/products/:productId', getReviewsByProduct);
router.get('/user/:userId', requireAuth, getReviewsByUser);
router.put('/update/:id', requireAuth, requireOwnershipOrAdmin(Review), updateReview);
router.delete('/delete/:id', requireAuth, requireOwnershipOrAdmin(Review), deleteReview);
router.get('/products', requireAuth, getAllProducts);
router.delete('/delete-bulk', requireAuthAndRole('admin'), deleteReviews);

module.exports = router;