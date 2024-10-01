const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

const createReview = async (req, res) => {
    const { title, rating, comment } = req.body;
    const productId = req.params.productId;
    const userId = req.user.userId;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const deliveredOrder = await Order.findOne({
            user: userId,
            'products.product': productId,
            status: 'delivered'
        });

        if (!deliveredOrder) {
            return res.status(403).json({ message: 'You must buy this product in order to leave a review' });
        }

        const existingReview = await Review.findOne({ product: productId, user: userId });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this product! Click here to edit it' });
        }

        const review = new Review({
            product: productId,
            user: userId,
            title,
            rating,
            comment
        });

        await review.save();
        await Product.findByIdAndUpdate(productId, { $push: { reviews: review._id } });

        res.status(201).json(review);
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
        const reviews = await Review.find()
            .populate({
                path: 'user',
                select: '_id firstName lastName email'
            })
            .populate({
                path: 'product',
                select: 'name description price salePrice category subcategory image inventoryCount'
            });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id)
            .populate({
                path: 'user',
                select: '_id firstName lastName email'
            })
            .populate({
                path: 'product',
                select: 'name description price salePrice category subcategory image inventoryCount'
            });
        if (!review) return res.status(404).json({ message: 'Review not found' });
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getReviewsByProduct = async (req, res) => {
    const productId = req.params.productId;

    try {
        const reviews = await Review.find({ product: productId })
            .populate({
                path: 'user',
                select: '_id firstName lastName email'
            })
            .populate({
                path: 'product',
                select: 'name description price salePrice category subcategory image inventoryCount'
            });

        if (reviews.length === 0) {
            return res.status(404).json({ message: 'No reviews found for this product' });
        }

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getReviewsByUser = async (req, res) => {
    const userId = req.params.userId;

    try {
        const reviews = await Review.find({ user: userId })
            .populate({
                path: 'user',
                select: '_id firstName lastName email'
            })
            .populate({
                path: 'product',
                select: 'name description price salePrice category subcategory image inventoryCount'
            });

        if (reviews.length === 0) {
            return res.status(404).json({ message: 'No reviews found for this user' });
        }

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateReview = async (req, res) => {
    const { title, rating, comment } = req.body;
    const userId = req.user.userId;
    const userRole = req.user.role;

    try {
        const review = await Review.findById(req.params.id);

        if (!review) return res.status(404).json({ message: 'Review not found' });

        if (review.user.toString() !== userId && userRole !== 'admin') {
            console.error('User mismatch:', userId, review.user.toString());
            return res.status(403).json({ message: 'You are not authorized to update this review' });
        }

        if (title !== undefined) review.title = title;
        if (rating !== undefined) review.rating = rating;
        if (comment !== undefined) review.comment = comment;
        review.updatedAt = Date.now();

        await review.save();

        const updatedReview = await Review.findById(req.params.id)
            .populate({
                path: 'user',
                select: '_id email'
            })
            .populate({
                path: 'product',
                select: 'name description price salePrice category subcategory image inventoryCount'
            });

        res.status(200).json(updatedReview);
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ message: 'Server error', error: error.message, stack: error.stack });
    }
};

const deleteReview = async (req, res) => {
    const userId = req.user.userId;
    const userRole = req.user.role;
    try {
        const review = await Review.findById(req.params.id);

        if (!review) return res.status(404).json({ message: 'Review not found' });

        if (review.user.toString() !== userId && userRole !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to delete this review' });
        }

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

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'Invalid or empty ids array' });
    }

    const userId = req.user.userId;
    const userRole = req.user.role;

    try {
        const reviews = await Review.find({ _id: { $in: ids } });

        if (reviews.length !== ids.length) {
            return res.status(404).json({ message: 'One or more reviews not found' });
        }

        for (const review of reviews) {
            if (review.user.toString() !== userId && userRole !== 'admin') {
                return res.status(403).json({ message: 'You are not authorized to delete one or more of these reviews' });
            }
        }

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

module.exports = { createReview, checkReviewEligibility, getReviews, getReview, getReviewsByProduct, getReviewsByUser, updateReview, deleteReview, getAllProducts, deleteReviews };