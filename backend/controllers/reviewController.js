const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { reviewEmailQueue } = require('../config/email/queues');

const populateR = (query) => {
    return query.populate([
        { path: 'user', select: '_id firstName lastName email' },
        { path: 'product', select: 'name slug description price salePrice category subcategory image inventoryCount' },
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

        const savedReview = await review.save();

        const populatedReview = await Review.findById(savedReview._id)
            .populate('user')
            .populate('product');

        res.status(201).json({ message: 'Review created successfully', review });

        await Product.findByIdAndUpdate(productId, { $push: { reviews: review._id } });

        if (populatedReview.user?.email) {
            reviewEmailQueue.add({ review: populatedReview });
        } else {
            console.warn(`Review ${savedReview._id} has no associated email.`);
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating review', error: error.message });
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

        if (order) return res.json({ canReview: true });

        return res.json({ canReview: false });
    } catch (error) {
        console.error('Error checking review eligibility:', error);
        res.status(500).json({ success: false, message: 'Error checking review eligibility', error: error.message });
    }
};

const getReviews = async (req, res) => {
    try {
        const reviews = await populateR(Review.find()).sort({ createdAt: -1 });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error getting reviews', error: error.message });
    }
};

const getReviewById = async (req, res) => {
    try {
        const review = await populateR(Review.findById(req.params.id));
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error getting review', error: error.message });
    }
};

const getReviewsByProduct = async (req, res) => {
    const productId = req.params.productId;

    try {
        const reviews = await populateR(Review.find({ product: productId }));
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error getting reviews', error: error.message });
    }
};

const getUserReviews = async (req, res) => {
    const userId = req.params.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;
    const searchTerm = req.query.search || '';
    const ratingFilter = req.query.rating || '';

    try {
        const authUserId = req.user.userId.toString();
        const requestedUserId = userId.toString();
        const userRole = req.user.role;

        if (requestedUserId !== authUserId && userRole !== 'admin') return res.status(403).json({ success: false, message: 'Unauthorized access to user reviews' });

        let query = { user: userId };

        if (ratingFilter && ratingFilter !== 'all') {
            const minRating = parseInt(ratingFilter);
            if (ratingFilter === '5') {
                query.rating = 5;
            } else {
                query.rating = { $gte: minRating };
            }
        }

        if (searchTerm) {
            const allReviews = await populateR(Review.find(query).sort({ createdAt: -1 }));

            const filteredReviews = allReviews.filter(review => {
                const searchLower = searchTerm.toLowerCase();

                const reviewFieldsMatch = (
                    review._id.toString().toLowerCase().includes(searchLower) ||
                    review.comment?.toLowerCase().includes(searchLower) ||
                    review.rating?.toString().includes(searchTerm) ||
                    review.title?.toLowerCase().includes(searchLower)
                );

                const productFieldsMatch = review.product && (
                    review.product.name?.toLowerCase().includes(searchLower) ||
                    review.product.slug?.toLowerCase().includes(searchLower)
                );

                return reviewFieldsMatch || productFieldsMatch;
            });

            const totalReviews = filteredReviews.length;
            const paginatedReviews = filteredReviews.slice(skip, skip + limit);

            const totalPages = Math.ceil(totalReviews / limit);
            const hasNextPage = page < totalPages;
            const hasPreviousPage = page > 1;

            return res.status(200).json({
                success: true,
                reviews: paginatedReviews,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalReviews,
                    hasNextPage,
                    hasPreviousPage,
                    limit
                }
            });
        }

        const totalReviews = await Review.countDocuments(query);

        const reviews = await populateR(
            Review.find(query)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
        );

        const totalPages = Math.ceil(totalReviews / limit);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;

        res.status(200).json({
            success: true,
            reviews,
            pagination: {
                currentPage: page,
                totalPages,
                totalReviews,
                hasNextPage,
                hasPreviousPage,
                limit
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error getting reviews by user', error: error.message });
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
        res.status(200).json({ success: true, message: 'Review updated successfully', updatedReview });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating review', error: error.message });
    }
};

const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        await Review.findByIdAndDelete(req.params.id);
        await Product.findByIdAndUpdate(review.product, { $pull: { reviews: review._id } });

        res.status(200).json({ success: true, message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting review', error: error.message });
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

        res.status(200).json({ success: true, message: 'Reviews and references in products deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting reviews', error: error.message });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().select('name');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error getting products', error: error.message });
    }
};

module.exports = { createReview, checkReviewEligibility, getReviews, getReviewById, getReviewsByProduct, getUserReviews, updateReview, deleteReview, getAllProducts, deleteReviews };