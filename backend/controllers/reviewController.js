const Review = require('../models/Review');
const Product = require('../models/Product');

const createReview = async (req, res) => {
    const { rating, comment } = req.body;
    const productId = req.params.productId;
    const userId = req.user.userId;

    try {
        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the user has already reviewed this product
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
                select: '-email -password -role'
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
                select: '-email -password -role'
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
    try {
        const review = await Review.findByIdAndUpdate(req.params.id,
            { rating, comment, updatedAt: Date.now() },
            { new: true }
        )
            .populate({
                path: 'user',
                select: '-email -password -role'
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

const deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) return res.status(404).json({ message: 'Review not found' });
        await Product.findByIdAndUpdate(review.product, { $pull: { reviews: review._id } });
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
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