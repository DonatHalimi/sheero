const yup = require('yup');
const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

const isValidTitle = (v) => /^[A-Z][\Wa-zA-Z\s]{2,40}$/.test(v);
const isValidRating = (v) => /^([1-5])$/.test(v);
const isValidComment = (v) => /^[A-Z][\Wa-zA-Z\s]{3,500}$/.test(v);

const createSchema = yup.object({
    productId: yup
        .string()
        .required('Product ID is required')
        .test('product-exists', 'Product not found', async function (value) {
            if (!value) return false;
            const product = await Product.findById(value);
            return !!product;
        })
        .test('is-product-delivered', 'You must have this product in your orders with the status as "delivered" in order to leave a review', async function (value) {
            if (!value) return false;
            const user = this.options.context.user;
            const deliveredOrder = await Order.findOne({
                user: user.userId,
                'products.product': value,
                status: 'delivered'
            });
            return !!deliveredOrder;
        })
        .test('review-exists', 'You have already reviewed this product! Click here to edit it', async function (value) {
            if (!value) return false;
            const user = this.options.context.user;
            const review = await Review.findOne({ product: value, user: user.userId });
            return !review;
        }),
    title: yup
        .string()
        .required('Title is required')
        .test('is-valid-title', 'Title must start with a capital letter and be 2-40 characters long', isValidTitle),
    rating: yup
        .string()
        .required('Rating is required')
        .test('is-valid-rating', 'Rating must be a number between 1 and 5', isValidRating),
    comment: yup
        .string()
        .required('Comment is required')
        .test('is-valid-comment', 'Comment must start with a capital letter and be 3-500 characters long', isValidComment),
});

const getByIdSchema = yup.object({
    id: yup
        .string()
        .required('ID is required')
        .test('id-validation', 'Review not found', async function (value) {
            if (!value) return false;
            const review = await Review.findById(value);
            return !!review;
        }),
});

const getByProductSchema = yup.object({
    productId: yup
        .string()
        .required('Product ID is required')
        .test('product-has-reviews', 'No reviews found for this product', async function (value) {
            if (!value) return false;
            const reviews = await Review.find({ product: value });
            return reviews.length > 0;
        }),
});

const getByUserSchema = yup.object({
    userId: yup
        .string()
        .required('User ID is required')
        .test('user-has-reviews', 'No reviews found for this user', async function (value) {
            if (!value) return false;
            const reviews = await Review.find({ user: value });
            return reviews.length > 0;
        }),
});

const updateSchema = yup.object({
    id: yup
        .string()
        .required('Review ID is required')
        .test('id-validation', 'Review not found', async function (value) {
            if (!value) return false;
            const review = await Review.findById(value);
            return !!review;
        }),
    title: yup
        .string()
        .test('is-valid-title', 'Title must start with a capital letter and be 2-40 characters long', value => {
            if (!value) return true;
            return isValidTitle(value);
        }),
    comment: yup
        .string()
        .test('is-valid-comment', 'Comment must start with a capital letter and be 3-500 characters long', value => {
            if (!value) return true;
            return isValidComment(value);
        }),
    rating: yup
        .string()
        .test('is-valid-rating', 'Rating must be a number between 1 and 5', value => {
            if (!value) return true;
            return isValidRating(value);
        }),
});

const deleteSchema = yup.object({
    id: yup
        .string()
        .required('Review ID is required')
        .test('id-validation', 'Review not found', async function (value) {
            if (!value) return false;
            const review = await Review.findById(value);
            return !!review;
        }),
})

const deleteBulkSchema = yup.object({
    ids: yup
        .array()
        .of(yup.string().required('ID is required'))
        .min(1, 'At least one ID is required')
        .required('IDs are required')
        .test('reviews-exist', 'One or more reviews not found', async function (ids) {
            const reviews = await Review.find({ _id: { $in: ids } });
            return reviews.length === ids.length;
        }),
});

module.exports = { createSchema, getByIdSchema, getByProductSchema, getByUserSchema, updateSchema, deleteSchema, deleteBulkSchema };