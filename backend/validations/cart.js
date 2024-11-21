const yup = require('yup');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

const addSchema = yup.object({
    productId: yup
        .string()
        .required('Product ID is required')
        .test('product-exists', 'Product not found', async function (value) {
            if (!value) return false;
            const product = await Product.findById(value);
            return !!product;
        }),
    quantity: yup
        .number()
        .typeError('Quantity must be a number')
        .required('Quantity is required')
        .positive('Quantity must be a positive number')
        .integer('Quantity must be an integer'),
});

const updateSchema = yup.object({
    productId: yup
        .string()
        .required('Product ID is required')
        .test('product-exists', 'Product not found', async function (value) {
            if (!value) return false;
            const product = await Product.findById(value);
            return !!product;
        })
        .test('product-in-cart', 'Product not found in cart', async function (id) {
            const user = this.options.context.user;

            const cart = await Cart.findOne({ user: user.userId });
            if (!cart) return false;

            return cart.items.some(item => item.product.toString() === id);
        }),
    quantityChange: yup
        .number()
        .typeError('Quantity change must be a number')
        .required('Quantity change is required')
        .integer('Quantity change must be an integer'),
});

const removeSchema = yup.object({
    productId: yup
        .string()
        .required('Product ID is required')
        .test('product-exists', 'Product not found', async function (value) {
            if (!value) return false;
            const product = await Product.findById(value);
            return !!product;
        })
        .test('product-in-cart', 'Product is not in the cart', async function (value) {
            const user = this.options.context.user;
            const cart = await Cart.findOne({ user: user.userId });
            if (!cart) return false;
            return cart.items.some(item => item.product.toString() === value);
        }),
});

const clearSchema = yup.object({
    productId: yup
        .string()
        .test('cart-empty', 'No products found in the cart', async function (value) {
            const user = this.options.context.user;
            const cart = await Cart.findOne({ user: user.userId });
            if (!cart || cart.items.length === 0) return false;
            return true;
        }),
});

module.exports = { addSchema, updateSchema, removeSchema, clearSchema };