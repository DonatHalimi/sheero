const Product = require('../models/Product');
const Review = require('../models/Review');
const fs = require('fs');

const createProduct = async (req, res) => {
    const { name, description, price, salePrice, category, subcategory, subSubcategory, inventoryCount, dimensions, variants, discount, supplier, shipping, details } = req.body;
    const image = req.file ? req.file.path : '';
    try {
        const product = new Product({
            name, description, price, salePrice, category, subcategory, subSubcategory, inventoryCount, dimensions, variants, discount, supplier, shipping, image, details
        });
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category subcategory subSubcategory supplier');
        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category subcategory subSubcategory supplier');
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updateProduct = async (req, res) => {
    const { name, description, price, salePrice, category, subcategory, subSubcategory, inventoryCount, dimensions, variants, discount, supplier, shipping, details } = req.body;
    let image = req.body.image;
    try {
        const oldProduct = await Product.findById(req.params.id);
        if (!oldProduct) return res.status(404).json({ message: 'Product not found' });

        if (req.file) {
            if (oldProduct.image) {
                fs.unlink(oldProduct.image, (err) => {
                    if (err) console.error('Error deleting old image:', err);
                });
            }
            image = req.file.path;
        } else if (image === null || image === '') {
            if (oldProduct.image) {
                fs.unlink(oldProduct.image, (err) => {
                    if (err) console.error('Error deleting old image:', err);
                });
            }
            image = '';
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name, description, price, salePrice, category, subcategory, subSubcategory, inventoryCount, dimensions, variants, discount, supplier, shipping, image, details, updatedAt: Date.now()
            },
            { new: true }
        );
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Remove associated reviews
        await Review.deleteMany({ product: product._id });

        // Remove the product image
        if (product.image) {
            fs.unlink(product.image, (err) => {
                if (err) console.error('Error deleting image:', err);
            });
        }
        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Product and associated reviews deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteProducts = async (req, res) => {
    const { productIds } = req.body;
    try {
        const products = await Product.find({ _id: { $in: productIds } });

        if (products.length !== productIds.length) {
            return res.status(404).json({ message: 'One or more products not found' });
        }

        for (const product of products) {
            // Remove associated reviews
            await Review.deleteMany({ product: product._id });

            // Remove the product image
            if (product.image) {
                fs.unlink(product.image, (err) => {
                    if (err) console.error('Error deleting image:', err);
                });
            }
        }

        await Product.deleteMany({ _id: { $in: productIds } });

        res.status(200).json({ message: 'Products and associated reviews deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createProduct, getProducts, getProduct, updateProduct, deleteProduct, deleteProducts };