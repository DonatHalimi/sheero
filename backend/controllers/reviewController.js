const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

const populateR = (query) => {
    return query.populate([
        { path: 'user', select: '_id firstName lastName email' },
        { path: 'product', select: 'name description price salePrice category subcategory image inventoryCount' },
    ]);
};

const createReview = async (req, res) => {
    const { title, rating, comment } = req.body;
    const productId = req.params.productId;
    const userId = req.user.userId;

    try {
        const review = new Review({
            product: productId,
            user: userId,
            title,
            rating,
            comment
        });

        await review.save();
        await Product.findByIdAndUpdate(productId, { $push: { reviews: review._id } });

        res.status(201).json({ message: 'Review created succesfully', review });
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ message: 'Server error', error: error.message, stack: error.stack });
    }
};

const checkReviewEligibility = async (req, res) => {
    const userId = req.user.userId;
    const productId = req.params.productId;

    try {
        const order = await Order.findOne({
            user: userId,
            'products.product': productId,
            status: 'delivered'
        });

        if (order) {
            return res.json({ canReview: true });
        }

        return res.json({ canReview: false });
    } catch (error) {
        console.error('Error checking review eligibility:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getReviews = async (req, res) => {
    try {
        const reviews = await populateR(Review.find());
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getReviewById = async (req, res) => {
    try {
        const review = await populateR(Review.findById(req.params.id));
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getReviewsByProduct = async (req, res) => {
    const productId = req.params.productId;

    try {
        const reviews = await populateR(Review.find({ product: productId }));
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getReviewsByUser = async (req, res) => {
    const userId = req.params.userId;

    try {
        const reviews = await populateR(Review.find({ user: userId }));
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateReview = async (req, res) => {
    const { title, rating, comment } = req.body;

    try {
        const review = await Review.findById(req.params.id);

        if (title !== undefined) review.title = title;
        if (rating !== undefined) review.rating = rating;
        if (comment !== undefined) review.comment = comment;
        review.updatedAt = Date.now();

        await review.save();

        const updatedReview = await populateR(Review.findById(req.params.id));
        res.status(200).json({ message: 'Review updated successfully', updatedReview });
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ message: 'Server error', error: error.message, stack: error.stack });
    }
};

const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        await Review.findByIdAndDelete(req.params.id);
        await Product.findByIdAndUpdate(review.product, { $pull: { reviews: review._id } });

        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ message: 'Server error', error: error.message, stack: error.stack });
    }
};
const deleteReviews = async (req, res) => {
    const { ids } = req.body;

    try {
        const reviews = await Review.find({ _id: { $in: ids } });

        const productIds = reviews.map(review => review.product);
        
        await Review.deleteMany({ _id: { $in: ids } });

        await Product.updateMany(
            { _id: { $in: productIds } },
            { $pull: { reviews: { $in: ids } } }
        );

        res.status(200).json({ message: 'Reviews and references in products deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().select('name');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createReview, checkReviewEligibility, getReviews, getReviewById, getReviewsByProduct, getReviewsByUser, updateReview, deleteReview, getAllProducts, deleteReviews };