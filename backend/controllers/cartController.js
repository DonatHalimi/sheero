const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getCart = async (req, res) => {
    try {
        const userId = req.user.userId;

        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

const addToCart = async (req, res) => {
    try {
        const userId = req.user.userId;

        const { productId, quantity } = req.body;

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const cartItemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (cartItemIndex > -1) {
            cart.items[cartItemIndex].quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.calculateTotalPrice();

        await cart.save();

        res.status(200).json(cart);
    } catch (err) {
        console.error('Error adding to cart:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

const updateCartItem = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId, quantity } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const cartItemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (cartItemIndex > -1) {
            cart.items[cartItemIndex].quantity = quantity;
            cart.calculateTotalPrice();
            await cart.save();
            return res.status(200).json(cart);
        }

        res.status(404).json({ message: 'Product not found in cart' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const initialItemCount = cart.items.length;
        cart.items = cart.items.filter(item => item.product.toString() !== productId);

        if (initialItemCount === cart.items.length) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        cart.calculateTotalPrice();
        await cart.save();

        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };