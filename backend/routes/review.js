const express = require('express');
const { createReview, getReviews, getReview, updateReview, deleteReview, getAllProducts, deleteReviews } = require('../controllers/reviewController');
const { protect, requireAuthAndRole } = require('../middleware/auth');

const router = express.Router();

router.post('/product/:productId', protect, createReview);
router.get('/get', getReviews);
router.get('/get/:id', getReview);
router.put('/update/:id', protect, updateReview);
router.delete('/delete/:id', protect, deleteReview);
router.get('/products', protect, getAllProducts);
router.delete('/delete-bulk', protect, requireAuthAndRole('admin'), deleteReviews);

module.exports = router;