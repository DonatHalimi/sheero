const Cart = require('../models/Cart');

const addToCart = async (req, res) => {
    const userId = req.user.userId;
    const { productId, quantity } = req.body;

    try {
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        const cartItemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (cartItemIndex > -1) {
            cart.items[cartItemIndex].quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.calculateTotalPrice();

        await cart.save();
        res.status(201).json({ message: 'Cart created successfully', cart });
    } catch (err) {
        console.error('Error adding to cart:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

const getCartByUser = async (req, res) => {
    const userId = req.user.userId;

    try {
        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

const getAllCarts = async (req, res) => {
    try {
        const cart = await Cart.find().populate('items.product');
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
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
    } catch (err) {
        console.error('Error updating cart item quantity:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
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
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
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
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

module.exports = { addToCart, getCartByUser, getAllCarts, updateCartItemQuantity, removeFromCart, clearCart };
