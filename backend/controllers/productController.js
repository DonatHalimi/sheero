const Product = require('../models/Product');
const Category = require('../models/Category')
const Subcategory = require('../models/Subcategory')
const SubSubcategory = require('../models/SubSubcategory')
const Review = require('../models/Review');
const fs = require('fs');
const User = require('../models/User');
const ProductRestockSubscription = require('../models/ProductRestockSubscription');
const { sendProductRestockNotificationEmail, sendProductRestockSubscriptionEmail } = require('../config/emailService');

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

const getProductBySlug = async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug }).populate('category subcategory subSubcategory supplier');
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
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
        const subcategory = await Subcategory.findOne({ slug: req.params.slug });
        if (!subcategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }

        const products = await Product.find({ subcategory: subcategory._id }).populate('category subcategory subSubcategory');

        if (!products || products.length === 0) {
            return res.status(404).json({ message: `No products found for subcategory: ${subcategory.name}` });
        }

        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getProductsBySubSubCategory = async (req, res) => {
    try {
        const subSubcategory = await SubSubcategory.findOne({ slug: req.params.slug });
        if (!subSubcategory) {
            return res.status(404).json({ message: 'SubSubcategory not found' });
        }

        const products = await Product.find({ subSubcategory: subSubcategory._id }).populate('category subcategory subSubcategory');
        if (!products || products.length === 0) {
            return res.status(404).json({ message: `No products found for subsubcategory: ${subSubcategory.name}` });
        }
        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateProduct = async (req, res) => {
    const { name, description, price, salePrice, category, subcategory, subSubcategory, inventoryCount, dimensions, variants, discount, supplier, shipping, details } = req.body;
    let image = req.body.image;

    try {
        const oldProduct = await Product.findById(req.params.id);
        if (!oldProduct) return res.status(404).json({ message: 'Product not found' });

        const wasOutOfStock = oldProduct.inventoryCount === 0;

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

        if (wasOutOfStock && product.inventoryCount > 0) {
            const subscriptions = await ProductRestockSubscription.find({ productId: product._id });
            for (const sub of subscriptions) {
                try {
                    await sendProductRestockNotificationEmail(sub.email, product);
                    await ProductRestockSubscription.deleteOne({ _id: sub._id });
                } catch (emailError) {
                    console.error(`Failed to send restock email to ${sub.email}:`, emailError);
                }
            }
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const sendRestockSubscriptionEmail = async (email, product, subscription) => {
    try {
        await sendProductRestockSubscriptionEmail(email, product, subscription);
    } catch (error) {
        console.error(`Failed to send subscription confirmation email to ${email}:`, error);
    }
};

const subscribeForRestock = async (req, res) => {
    const { email } = req.body;
    const productId = req.params.productId;

    if (!email) return res.status(400).json({ message: 'Email is required.' });

    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found.' });

        const existingSubscription = await ProductRestockSubscription.findOne({ productId, email });
        if (existingSubscription) {
            return res.status(200).json({
                alreadySubscribed: true,
                message: 'Your email is already subscribed to receive restock notifications for this product'
            });
        }

        const subscription = await ProductRestockSubscription.create({ productId, email });

        res.status(200).json({
            alreadySubscribed: false,
            message: 'You will receive an email when the product is restocked',
            subscription
        });

        sendRestockSubscriptionEmail(email, product, subscription);
    } catch (error) {
        console.error('Error subscribing for restock:', error);
        res.status(500).json({ message: 'Error creating subscription.', error: error.message });
    }
};

const getUserRestockSubscription = async (req, res) => {
    try {
        const email = req.query.email || req.user?.email;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const subscription = await ProductRestockSubscription.findOne({ email });

        res.json({ isSubscribed: !!subscription });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const deleteUserRestockSubscription = async (req, res) => {
    try {
        if (!req.user?.userId) return res.status(400).json({ message: "User ID is required" });

        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const subscription = await ProductRestockSubscription.findOneAndDelete({ email: user.email });

        res.json({ isSubscribed: !!subscription, message: "Product restock subscription deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const getAllRestockSubscriptions = async (req, res) => {
    try {
        const subscriptions = await ProductRestockSubscription.find()
            .populate('productId', 'name slug image inventoryCount')
            .exec();

        res.status(200).json(subscriptions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching subscriptions.', error: error.message });
    }
};

const deleteRestockSubscription = async (req, res) => {
    try {
        const subscription = await ProductRestockSubscription.findByIdAndDelete(req.params.id);

        if (!subscription) return res.status(404).json({ message: 'Subscription not found' });

        res.status(200).json({ message: 'Subscription deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting subscription.', error: error.message });
    }
};

const deleteRestockSubscriptions = async (req, res) => {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'Invalid or empty ids array' });
    }

    try {
        const subscriptions = await ProductRestockSubscription.find({ _id: { $in: ids } });

        if (subscriptions.length !== ids.length) {
            return res.status(404).json({ message: 'One or more subscriptions not found' });
        }

        await ProductRestockSubscription.deleteMany({ _id: { $in: ids } });

        res.status(200).json({ message: 'Subscriptions deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting subscriptions.', error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    const requestingUser = await User.findById(req.user.userId).populate('role');
    if (requestingUser.role.name !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        await Review.deleteMany({ product: product._id });

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
    const requestingUser = await User.findById(req.user.userId).populate('role');
    if (requestingUser.role.name !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }

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
            await Review.deleteMany({ product: product._id });

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
                        path: ['name', 'description', 'category'],
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

// Three new functions to evade network timeouts for 'AddProductModal'
const createProductBasic = async (req, res) => {
    const requestingUser = await User.findById(req.user.userId).populate('role');
    if (requestingUser.role.name !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }

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
    const requestingUser = await User.findById(req.user.userId).populate('role');
    if (requestingUser.role.name !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }

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
    const requestingUser = await User.findById(req.user.userId).populate('role');
    if (requestingUser.role.name !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }

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

module.exports = {
    createProduct, getProducts, getProductBySlug, updateProduct, subscribeForRestock, getUserRestockSubscription, deleteUserRestockSubscription, getAllRestockSubscriptions, deleteRestockSubscription, deleteRestockSubscriptions,
    getProductsByCategory, getProductsBySubCategory, getProductsBySubSubCategory,
    deleteProduct, deleteProducts, searchProducts, createProductBasic, uploadProductImage, addProductVariantsAndDetails
};