const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory')
const Product = require('../models/Product')
const fs = require('fs');
const User = require('../models/User');

const createCategory = async (req, res) => {
    const requestingUser = await User.findById(req.user.userId).populate('role');
    if (requestingUser.role.name !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const { name } = req.body;
    const image = req.file ? req.file.path : '';

    if (!name) {
        return res.status(400).json({ message: 'Category name is required' });
    }

    if (!image || !req.file) {
        return res.status(400).json({ message: 'Image is required' });
    }

    try {
        const category = new Category({ name, image });
        await category.save();
        res.status(201).json({ message: 'Category created succesfully', category });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        if (!categories) return res.status(404).json({ message: 'Categories not found' });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updateCategory = async (req, res) => {
    const requestingUser = await User.findById(req.user.userId).populate('role');
    if (requestingUser.role.name !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const { name } = req.body;
    let image = req.body.image;
    try {
        const oldCategory = await Category.findById(req.params.id);
        if (!oldCategory) return res.status(404).json({ message: 'Category not found' });

        if (req.file) {
            if (oldCategory.image) {
                fs.unlink(oldCategory.image, (err) => {
                    if (err) console.error('Error deleting old image:', err);
                });
            }
            image = req.file.path;
        } else if (image === null || image === '') {
            if (oldCategory.image) {
                fs.unlink(oldCategory.image, (err) => {
                    if (err) console.error('Error deleting old image:', err);
                });
            }
            image = '';
        }

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name, image, updatedAt: Date.now() },
            { new: true }
        );
        res.status(200).json({ message: 'Category updated succesfully', category });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteCategory = async (req, res) => {
    const requestingUser = await User.findById(req.user.userId).populate('role');
    if (requestingUser.role.name !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        const products = await Product.find({ category: req.params.id });
        if (products.length > 0) {
            return res.status(400).json({ message: 'Cannot delete category with existing products' });
        }

        const subcategories = await Subcategory.find({ category: req.params.id });
        if (subcategories.length > 0) {
            return res.status(400).json({ message: 'Cannot delete category with existing subcategories' });
        }

        if (category.image) {
            fs.unlink(category.image, (err) => {
                if (err) console.error('Error deleting image:', err);
            });
        }

        await Category.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Category deleted succesfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteCategories = async (req, res) => {
    const requestingUser = await User.findById(req.user.userId).populate('role');
    if (requestingUser.role.name !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'Invalid or empty ids array' });
    }

    try {
        const categories = await Category.find({ _id: { $in: ids } });

        if (categories.length !== ids.length) {
            return res.status(404).json({ message: 'One or more categories not found' });
        }

        for (const category of categories) {
            const products = await Product.find({ category: req.params.id });
            if (products.length > 0) {
                return res.status(400).json({ message: `Cannot delete category ${category.name} with existing products` });
            }

            const subcategories = await Subcategory.find({ category: req.params.id });
            if (subcategories.length > 0) {
                return res.status(400).json({ message: `Cannot delete category ${category.name} with existing subcategories` });
            }

            if (category.image) {
                fs.unlink(category.image, (err) => {
                    if (err) console.error('Error deleting image:', err);
                });
            }
        }

        await Category.deleteMany({ _id: { $in: ids } });

        res.status(200).json({ message: 'Categories deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createCategory, getCategories, getCategory, updateCategory, deleteCategory, deleteCategories };