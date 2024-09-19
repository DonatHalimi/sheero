const Product = require('../models/Product');
const Category = require('../models/Category')
const Subcategory = require('../models/Subcategory')
const SubSubcategory = require('../models/SubSubcategory')
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
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category subcategory subSubcategory supplier');
        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category subcategory subSubcategory supplier');
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getProductsByCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        const products = await Product.find({ category: category._id }).populate('category subcategory subSubcategory');
        if (!products || products.length === 0) {
            return res.status(404).json({ message: `No products found with category: ${category.name}` });
        }
        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const getProductsBySubCategory = async (req, res) => {
    try {
        const subcategory = await Subcategory.findById(req.params.id);
        if (!subcategory) return res.status(404).json({ message: 'Subcategory not found' });

        const products = await Product.find({ subcategory: subcategory._id }).populate('category subcategory subSubcategory');
        if (!products || products.length === 0) {
            return res.status(404).json({ message: `No products found with subcategory: ${subcategory.name}` });
        }
        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const getProductsBySubSubCategory = async (req, res) => {
    try {
        const subSubcategory = await SubSubcategory.findById(req.params.id);
        if (!subSubcategory) return res.status(404).json({ message: 'SubSubcategory not found' });

        const products = await Product.find({ subSubcategory: subSubcategory._id }).populate('category subcategory subSubcategory');
        if (!products || products.length === 0) {
            return res.status(404).json({ message: `No products found with subSubcategory: ${subSubcategory.name}` });
        }
        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

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
        res.status(500).json({ message: 'Server error', error: error.message });
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
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'Invalid or empty ids array' });
    }

    try {
        const products = await Product.find({ _id: { $in: ids } });

        if (products.length !== ids.length) {
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

        await Product.deleteMany({ _id: { $in: ids } });

        res.status(200).json({ message: 'Products and associated reviews deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const searchProducts = async (req, res) => {
    const { query } = req.query;

    try {
        const results = await Product.aggregate([
            {
                $search: {
                    index: 'default',
                    text: {
                        query: query,
                        path: ['name', 'description'],
                        fuzzy: {
                            maxEdits: 2,
                            prefixLength: 0,
                            maxExpansions: 50,
                        }
                    }
                }
            },
            {
                $limit: 10,
            },
            {
                $project: {
                    name: 1,
                    image: 1,
                    category: 1,
                    subCategory: 1,
                    subSubcategory: 1,
                    price: 1,
                    salePrice: 1,
                },
            },
        ]);

        res.status(200).json({ results });
    } catch (error) {
        console.error('Atlas Search error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Three new functions to evade network timeouts
const createProductBasic = async (req, res) => {
    const { name, description, price, salePrice, category, subcategory, subSubcategory, inventoryCount, supplier, image } = req.body;

    try {
        const product = new Product({
            name,
            description,
            price,
            salePrice,
            category,
            subcategory,
            subSubcategory,
            inventoryCount,
            dimensions: {},
            variants: [],
            discount: {},
            supplier: supplier || null,
            shipping: {},
            image: '',
            details: []
        });
        await product.save();
        res.status(201).json({ productId: product._id, message: 'Basic product created' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const uploadProductImage = async (req, res) => {
    const { productId } = req.body;
    const image = req.file ? req.file.path : '';

    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        product.image = image;
        await product.save();

        res.status(200).json({ message: 'Image uploaded successfully', image });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const addProductVariantsAndDetails = async (req, res) => {
    const { productId, variants, dimensions, discount, supplier, shipping, details } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        product.variants = variants !== undefined ? variants : product.variants;
        product.dimensions = dimensions !== undefined ? dimensions : product.dimensions;
        product.discount = discount !== undefined ? discount : product.discount;
        product.supplier = supplier !== undefined ? supplier : product.supplier;
        product.shipping = shipping !== undefined ? shipping : product.shipping;
        product.details = details !== undefined ? details : product.details;

        await product.save();

        res.status(200).json({ message: 'Variants, dimensions, and details added successfully', product });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createProduct, getProducts, getProduct, updateProduct, getProductsByCategory, getProductsBySubCategory, getProductsBySubSubCategory, deleteProduct, deleteProducts, searchProducts, createProductBasic, uploadProductImage, addProductVariantsAndDetails };