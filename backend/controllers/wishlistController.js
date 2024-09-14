const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const User = require('../models/User');

const getWishlist = async (req, res) => {
    try {
        const userId = req.user.userId;
        const wishlist = await Wishlist.findOne({ user: userId }).populate('items.product');
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }
        res.json(wishlist);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

const getWishlistByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the wishlist by user ID
        const wishlist = await Wishlist.findOne({ user: userId }).populate('items.product');
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        // Respond with the wishlist and the user's username
        res.json({ username: user.username, items: wishlist.items });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

const addToWishlist = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) {
            wishlist = new Wishlist({ user: userId, items: [] });
        }

        const existingItem = wishlist.items.find(item => item.product.toString() === productId);
        if (existingItem) {
            return res.status(400).json({ message: 'Product is already in your wishlist' });
        }

        wishlist.items.push({ product: productId });
        await wishlist.save();

        res.status(200).json(wishlist);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        const itemIndex = wishlist.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Product not found in wishlist' });
        }

        wishlist.items.splice(itemIndex, 1);
        await wishlist.save();

        res.status(200).json(wishlist);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

const clearWishlist = async (req, res) => {
    try {
        const userId = req.user.userId;

        const wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        if (wishlist.items.length === 0) {
            return res.status(404).json({ message: 'No products found in wishlist' });
        }

        wishlist.items = [];
        await wishlist.save();

        res.status(200).json({ message: 'Wishlist cleared' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

module.exports = { getWishlist, getWishlistByUserId, addToWishlist, removeFromWishlist, clearWishlist };