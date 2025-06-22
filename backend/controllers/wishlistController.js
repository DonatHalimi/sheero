const Wishlist = require('../models/Wishlist');
const User = require('../models/User');

const addToWishlist = async (req, res) => {
    const userId = req.user.userId;
    const { productId } = req.body;

    try {
        let wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) {
            wishlist = new Wishlist({ user: userId, items: [] });
        }

        wishlist.items.push({ product: productId });
        await wishlist.save();

        res.status(201).json({ success: true, message: 'Product added to wishlist successfully', wishlist });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error adding product to wishlist', error: error.message });
    }
};

const getWishlist = async (req, res) => {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    try {
        const authUserId = req.user.userId.toString();
        const requestedUserId = userId.toString();
        const userRole = req.user.role;

        if (requestedUserId !== authUserId && userRole !== 'admin') return res.status(403).json({ success: false, message: 'Unauthorized access to user wishlist' });

        const wishlist = await Wishlist.findOne({ user: userId })
            .populate({
                path: 'items.product',
                model: 'Product'
            });

        if (!wishlist) return res.status(404).json({ success: false, message: 'Wishlist not found' });

        const totalItems = wishlist.items.length;
        const paginatedItems = wishlist.items.slice(skip, skip + limit);
        const totalPages = Math.ceil(totalItems / limit);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;

        res.json({
            success: true,
            items: paginatedItems,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems,
                hasNextPage,
                hasPreviousPage,
                limit
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching wishlist', error: error.message });
    }
};

const getWishlistByUserId = async (req, res) => {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const wishlist = await Wishlist.findOne({ user: userId }).populate('items.product');
        if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });

        const totalItems = wishlist.items.length;
        const paginatedItems = wishlist.items.slice(skip, skip + limit);
        const totalPages = Math.ceil(totalItems / limit);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;

        res.json({
            success: true,
            firstName: user.firstName,
            lastName: user.lastName,
            items: paginatedItems,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems,
                hasNextPage,
                hasPreviousPage,
                limit
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error getting wishlist', error: err.message });
    }
};

const removeFromWishlist = async (req, res) => {
    const userId = req.user.userId;
    const { productId } = req.body;

    try {
        const wishlist = await Wishlist.findOne({ user: userId });

        const itemIndex = wishlist.items.findIndex(item => item.product.toString() === productId);

        wishlist.items.splice(itemIndex, 1);
        await wishlist.save();

        res.status(200).json({ success: true, message: 'Product removed from wishlist', wishlist });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error removing product from wishlist', error: error.message });
    }
};

const clearWishlist = async (req, res) => {
    const userId = req.user.userId;

    try {
        const wishlist = await Wishlist.findOne({ user: userId });
        wishlist.items = [];
        await wishlist.save();
        res.status(200).json({ success: true, message: 'Wishlist cleared successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error clearing wishlist', error: error.message });
    }
};

module.exports = { getWishlist, getWishlistByUserId, addToWishlist, removeFromWishlist, clearWishlist };