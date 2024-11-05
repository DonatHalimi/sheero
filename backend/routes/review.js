const express = require('express');
const { checkReviewEligibility, createReview, getReviews, getReview, getReviewsByProduct, updateReview, deleteReview, getAllProducts, deleteReviews, getReviewsByUser } = require('../controllers/reviewController');
const { protect, requireAuthAndRole, requireOwnershipOrAdmin } = require('../middleware/auth');
const Review = require('../models/Review');

const router = express.Router();

router.get('/orders/check-review/:productId', protect, checkReviewEligibility);
router.post('/product/:productId', protect, createReview);
router.get('/get', requireAuthAndRole('admin'), getReviews);
router.get('/get/:id', requireAuthAndRole('admin'), getReview);
router.get('/products/:productId', getReviewsByProduct);
router.get('/user/:userId', protect, getReviewsByUser);
router.put('/update/:id', protect, requireOwnershipOrAdmin(Review), updateReview);
router.delete('/delete/:id', protect, requireOwnershipOrAdmin(Review), deleteReview);
router.get('/products', protect, getAllProducts);
router.delete('/delete-bulk', requireAuthAndRole('admin'), deleteReviews);

module.exports = router;