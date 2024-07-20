const express = require('express');
const { createReview, getReviews, getReview, updateReview, deleteReview, getAllProducts } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/product/:productId', protect, createReview);
router.get('/get', getReviews);
router.get('/get/:id', getReview);
router.put('/update/:id', protect, updateReview);
router.delete('/delete/:id', protect, deleteReview);
router.get('/products', protect, getAllProducts);

module.exports = router;