const Review = require('../models/Review');
const Product = require('../models/Product');

const createReview = async (req, res) => {
    const { rating, comment } = req.body;
    const productId = req.params.productId;
    const userId = req.user.userId;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const existingReview = await Review.findOne({ product: productId, user: userId });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this product' });
        }

        const review = new Review({
            product: productId,
            user: userId,
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

const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate({
                path: 'user',
                select: '_id username'
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
                select: '_id username'
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

const updateReview = async (req, res) => {
    const { rating, comment } = req.body;
    const userId = req.user.userId;
    const userRole = req.user.role; 

    try {
        const review = await Review.findById(req.params.id);

        if (!review) return res.status(404).json({ message: 'Review not found' });

        if (review.user.toString() !== userId && userRole !== 'admin') {
            console.error('User mismatch:', userId, review.user.toString());
            return res.status(403).json({ message: 'You are not authorized to update this review' });
        }

        // Update fields only if they are provided in the request body
        if (rating !== undefined) review.rating = rating;
        if (comment !== undefined) review.comment = comment;
        review.updatedAt = Date.now();

        await review.save();

        const updatedReview = await Review.findById(req.params.id)
            .populate({
                path: 'user',
                select: '_id username'
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

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().select('name');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createReview, getReviews, getReview, updateReview, deleteReview, getAllProducts };