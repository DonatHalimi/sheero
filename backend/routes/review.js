const express = require('express');
const { createReview, getReviews, getReview, getReviewsByProduct, updateReview, deleteReview, getAllProducts, deleteReviews, getReviewsByUser } = require('../controllers/reviewController');
const { protect, requireAuthAndRole } = require('../middleware/auth');

const router = express.Router();

router.post('/product/:productId', protect, createReview);
router.get('/get', requireAuthAndRole('admin'), getReviews);
router.get('/get/:id', requireAuthAndRole('admin'), getReview);
router.get('/products/:productId', getReviewsByProduct);
router.get('/user/:userId', protect, getReviewsByUser);
router.put('/update/:id', protect, updateReview);
router.delete('/delete/:id', protect, deleteReview);
router.get('/products', protect, getAllProducts);
router.delete('/delete-bulk', protect, requireAuthAndRole('admin'), deleteReviews);

module.exports = router;