const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory')
const Product = require('../models/Product')
const fs = require('fs');
const path = require('path');

const createCategory = async (req, res) => {
    const { name } = req.body;
    const image = req.file ? req.file.path : '';
    try {
        const category = new Category({ name, image });
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
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
    const { name } = req.body;
    let image = req.body.image;
    try {
        const oldCategory = await Category.findById(req.params.id);
        if (!oldCategory) return res.status(404).json({ message: 'Category not found' });

        if (req.file) {
            // If a new file is uploaded, delete the old one
            if (oldCategory.image) {
                fs.unlink(oldCategory.image, (err) => {
                    if (err) console.error('Error deleting old image:', err);
                });
            }
            image = req.file.path;
        } else if (image === null || image === '') {
            // If image is set to null or empty string, delete the old image
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
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        // Check if there are products associated with this category
        const products = await Product.find({ category: req.params.id });
        if (products.length > 0) {
            return res.status(400).json({ message: 'Cannot delete category with existing products' });
        }

        // Check if there are subcategories associated with this category
        const subcategories = await Subcategory.find({ category: req.params.id });
        if (subcategories.length > 0) {
            return res.status(400).json({ message: 'Cannot delete category with existing subcategories' });
        }

        // Delete the image file if it exists
        if (category.image) {
            fs.unlink(category.image, (err) => {
                if (err) console.error('Error deleting image:', err);
            });
        }

        await Category.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteCategories = async (req, res) => {
    const { categoryIds } = req.body;
    try {
        const categories = await Category.find({ _id: { $in: categoryIds } });

        if (categories.length !== categoryIds.length) {
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

        await Category.deleteMany({ _id: { $in: categoryIds } });

        res.status(200).json({ message: 'Categories deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createCategory, getCategories, getCategory, updateCategory, deleteCategory, deleteCategories };