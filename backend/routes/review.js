const express = require('express');
const { checkReviewEligibility, createReview, getReviews, getReviewById, getReviewsByProduct, updateReview, deleteReview, getAllProducts, deleteReviews, getReviewsByUser } = require('../controllers/reviewController');
const { requireAuth, requireAuthAndRole, requireOwnershipOrAdmin } = require('../middleware/auth');
const Review = require('../models/Review');
const { createSchema, getByIdSchema, getByProductSchema, getByUserSchema, updateSchema, deleteBulkSchema } = require('../validations/review');
const validate = require('../middleware/validation');

const router = express.Router();

router.get('/orders/check-review/:productId', requireAuth, checkReviewEligibility);
router.post('/product/:productId', requireAuth, validate(createSchema), createReview);
router.get('/get', requireAuthAndRole('admin'), getReviews);
router.get('/get/:id', requireAuthAndRole('admin'), validate(getByIdSchema), getReviewById);
router.get('/products/:productId', validate(getByProductSchema), getReviewsByProduct);
router.get('/user/:userId', requireAuth, validate(getByUserSchema), getReviewsByUser);
router.put('/update/:id', requireAuth, requireOwnershipOrAdmin(Review), validate(updateSchema), updateReview);
router.delete('/delete/:id', requireAuth, requireOwnershipOrAdmin(Review), deleteReview);
router.get('/products', requireAuth, getAllProducts);
router.delete('/delete-bulk', requireAuthAndRole('admin'), validate(deleteBulkSchema), deleteReviews);

module.exports = router;