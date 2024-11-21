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

        res.status(201).json({ message: 'Product added to wishlist succesfully', wishlist });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

const getWishlist = async (req, res) => {
    const userId = req.user.userId;

    try {
        const wishlist = await Wishlist.findOne({ user: userId }).populate('items.product');
        res.json(wishlist);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// For share wishlist feature
const getWishlistByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const wishlist = await Wishlist.findOne({ user: userId }).populate('items.product');
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        res.json({ firstName: user.firstName, lastName: user.lastName, items: wishlist.items });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
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

        res.status(200).json({ message: 'Product removed from wishlist', wishlist });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

const clearWishlist = async (req, res) => {
    const userId = req.user.userId;

    try {
        const wishlist = await Wishlist.findOne({ user: userId });
        wishlist.items = [];
        await wishlist.save();
        res.status(200).json({ message: 'Wishlist cleared successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

module.exports = { getWishlist, getWishlistByUserId, addToWishlist, removeFromWishlist, clearWishlist };