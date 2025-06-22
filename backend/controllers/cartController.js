const Cart = require('../models/Cart');
const Wishlist = require('../models/Wishlist');

const addToCart = async (req, res) => {
    const userId = req.user.userId;
    const { productId, quantity } = req.body;

    try {
        let cart = await Cart.findOne({ user: userId });

        if (!cart) cart = new Cart({ user: userId, items: [] });

        const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (existingItemIndex !== -1) {
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.calculateTotalPrice();
        await cart.save();

        res.status(201).json({ success: true, message: 'Cart created successfully', cart });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error adding to cart', error: error.message });
    }
};

const bulkAddToCart = async (req, res) => {
    const userId = req.user.userId;
    const { wishlistUserId } = req.body;

    try {
        const wishlist = await Wishlist.findOne({ user: wishlistUserId }).populate('items.product');

        if (!wishlist || wishlist.items.length === 0) return res.status(404).json({ success: false, message: 'Wishlist not found or empty' });

        let cart = await Cart.findOne({ user: userId });
        if (!cart) cart = new Cart({ user: userId, items: [] });

        let addedCount = 0;
        let updatedCount = 0;

        for (const wishlistItem of wishlist.items) {
            const productId = wishlistItem.product._id.toString();
            const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);

            if (existingItemIndex !== -1) {
                cart.items[existingItemIndex].quantity += 1;
                updatedCount++;
            } else {
                cart.items.push({ product: productId, quantity: 1 });
                addedCount++;
            }
        }

        await cart.calculateTotalPrice();
        await cart.save();

        let message = '';
        if (addedCount > 0 && updatedCount > 0) {
            message = `Added ${addedCount} new items and updated ${updatedCount} existing items in cart`;
        } else if (addedCount > 0) {
            message = `Added ${addedCount} items to cart`;
        } else if (updatedCount > 0) {
            message = `Updated ${updatedCount} items in cart`;
        } else {
            message = 'All items processed successfully';
        }

        res.status(200).json({
            success: true,
            message: message,
            cart,
            summary: {
                totalItemsProcessed: wishlist.items.length,
                newItemsAdded: addedCount,
                existingItemsUpdated: updatedCount
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error adding items to cart', error: error.message });
    }
};

const getCartByUser = async (req, res) => {
    const userId = req.user.userId;

    try {
        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        res.json(cart);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error getting cart', error: error.message });
    }
};

const getAllCarts = async (req, res) => {
    try {
        const cart = await Cart.find().populate('items.product');
        res.json(cart);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error getting all carts', error: error.message });
    }
};

const updateCartItemQuantity = async (req, res) => {
    const userId = req.user.userId;
    const { productId, quantityChange } = req.body;

    try {
        const cart = await Cart.findOne({ user: userId });

        const cartItemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        cart.items[cartItemIndex].quantity += quantityChange;

        if (cart.items[cartItemIndex].quantity <= 0) {
            cart.items.splice(cartItemIndex, 1);
        }

        await cart.calculateTotalPrice();
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating cart', error: error.message });
    }
};

const removeFromCart = async (req, res) => {
    const userId = req.user.userId;
    const { productId } = req.body;

    try {
        const cart = await Cart.findOne({ user: userId });

        cart.items = cart.items.filter(item => item.product.toString() !== productId);

        cart.calculateTotalPrice();
        await cart.save();

        res.status(200).json({ success: true, message: 'Product removed from cart', cart });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error removing product from cart', error: error.message });
    }
};

const clearCart = async (req, res) => {
    const userId = req.user.userId;

    try {
        const cart = await Cart.findOne({ user: userId });

        cart.items = [];
        cart.totalPrice = 0;

        await cart.save();

        res.status(200).json({ success: true, message: 'Cart cleared successfully', cart });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error clearing cart', error: error.message });
    }
};

module.exports = { addToCart, bulkAddToCart, getCartByUser, getAllCarts, updateCartItemQuantity, removeFromCart, clearCart };
