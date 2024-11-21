const yup = require('yup');
const Product = require('../models/Product');
const Wishlist = require('../models/Wishlist');

//        const wishlist = await Wishlist.findOne({ user: userId }).populate('items.product');
//if (!wishlist) {
//    return res.status(404).json({ message: 'Wishlist not found' });
//}

const addSchema = yup.object({
    productId: yup
        .string()
        .required('Product ID is required')
        .test('product-exists', 'Product not found', async function (value) {
            if (!value) return false;
            const product = await Product.findById(value);
            return !!product;
        })
        .test('product-not-in-wishlist', 'Product is already in your wishlist', async function (value) {
            const user = this.options.context.user;
            const wishlist = await Wishlist.findOne({ user: user.userId });
            if (!wishlist) return true;
            return !wishlist.items.some(item => item.product.toString() === value);
        }),
});

const removeSchema = yup.object({
    productId: yup
        .string()
        .required('Product ID is required')
        .test('wishlist-exists', 'Wishlist not found', async function (value) {
            const user = this.options.context.user;
            const wishlist = await Wishlist.findOne({ user: user.userId });
            if (!wishlist) return false;
            return true;
        })
        .test('product-exists', 'Product not found', async function (value) {
            if (!value) return false;
            const product = await Product.findById(value);
            return !!product;
        })
        .test('product-in-wishlist', 'Product not found in wishlist', async function (value) {
            const user = this.options.context.user;
            const wishlist = await Wishlist.findOne({ user: user.userId });
            if (!wishlist) return false;
            return wishlist.items.some(item => item.product.toString() === value);
        }),
});

const clearSchema = yup.object({
    productId: yup
        .string()
        .test('wishlist-empty', 'No products found in your wishlist', async function (value) {
            const user = this.options.context.user;
            const wishlist = await Wishlist.findOne({ user: user.userId });
            if (!wishlist || wishlist.items.length === 0) return false;
            return true;
        }),
});

module.exports = { addSchema, removeSchema, clearSchema };
