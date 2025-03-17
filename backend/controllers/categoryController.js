const Category = require('../models/Category');
const fs = require('fs');

const createCategory = async (req, res) => {
    const { name } = req.body;
    const image = req.file ? req.file.path : '';

    try {
        const category = new Category({ name, image, createdBy: req.user.userId });
        await category.save();
        res.status(201).json({ message: 'Category created successfully', category });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find()
            .populate('createdBy', 'firstName lastName email')
            .populate('updatedBy', 'firstName lastName email');
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getCategoryBySlug = async (req, res) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug });
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
            { name, image, updatedAt: Date.now(), updatedBy: req.user.userId },
            { new: true }
        );
        res.status(200).json({ message: 'Category updated successfully', category });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (category.image) {
            fs.unlink(category.image, (err) => {
                if (err) console.error('Error deleting image:', err);
            });
        }

        await Category.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteCategories = async (req, res) => {
    const { ids } = req.body;

    try {
        const categories = await Category.find({ _id: { $in: ids } });

        for (const category of categories) {
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

module.exports = { createCategory, getCategories, getCategoryBySlug, updateCategory, deleteCategory, deleteCategories };