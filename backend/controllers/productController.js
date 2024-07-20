const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

const createProduct = async (req, res) => {
    const {
        name, description, price, salePrice, category, subcategory, inventoryCount, dimensions, variants, discount, supplier, shipping
    } = req.body;
    const image = req.file ? req.file.path : '';
    try {
        const product = new Product({
            name, description, price, salePrice, category, subcategory, inventoryCount, dimensions, variants, discount, supplier, shipping, image
        });
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getProducts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const totalProducts = await Product.countDocuments();
        const products = await Product.find().populate('category subcategory supplier').skip(skip).limit(limit);
        const totalPages = Math.ceil(totalProducts / limit);

        res.status(200).json({ products, totalPages });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category subcategory supplier');
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updateProduct = async (req, res) => {
    const {
        name, description, price, salePrice, category, subcategory, inventoryCount, dimensions, variants, discount, supplier, shipping
    } = req.body;
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
                name, description, price, salePrice, category, subcategory, inventoryCount, dimensions, variants, discount, supplier, shipping, image, updatedAt: Date.now()
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

        if (product.image) {
            fs.unlink(product.image, (err) => {
                if (err) console.error('Error deleting image:', err);
            });
        }

        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createProduct, getProducts, getProduct, updateProduct, deleteProduct };