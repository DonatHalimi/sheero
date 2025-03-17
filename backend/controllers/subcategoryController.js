const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');
const fs = require('fs');

const createSubcategory = async (req, res) => {
    const { name, category } = req.body;
    const image = req.file ? req.file.path : '';

    try {
        const subcategory = new Subcategory({ name, category, image, createdBy: req.user.userId });
        await subcategory.save();
        res.status(201).json({ message: 'Subcategory created successfully', subcategory });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getSubcategories = async (req, res) => {
    try {
        const subcategories = await Subcategory.find()
            .populate('category')
            .populate('createdBy', 'firstName lastName email')
            .populate('updatedBy', 'firstName lastName email');
        res.status(200).json(subcategories);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getSubcategoryBySlug = async (req, res) => {
    try {
        const subcategory = await Subcategory.findOne({ slug: req.params.slug }).populate('category');
        if (!subcategory) return res.status(404).json({ message: 'Subcategory not found' });

        res.status(200).json(subcategory);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getSubcategoriesByCategory = async (req, res) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug });
        if (!category) return res.status(404).json([]);

        const subcategories = await Subcategory.find({ category: category._id });
        res.status(200).json(subcategories);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updateSubcategory = async (req, res) => {
    const { name, category } = req.body;
    let image = req.body.image;

    try {
        const oldSubcategory = await Subcategory.findById(req.params.id);

        if (req.file) {
            if (oldSubcategory.image) {
                fs.unlink(oldSubcategory.image, (err) => {
                    if (err) console.error('Error deleting old image:', err);
                });
            }
            image = req.file.path;
        } else if (image === null || image === '') {
            if (oldSubcategory.image) {
                fs.unlink(oldSubcategory.image, (err) => {
                    if (err) console.error('Error deleting old image:', err);
                });
            }
            image = '';
        }

        const subcategory = await Subcategory.findByIdAndUpdate(
            req.params.id,
            { name, image, category, updatedAt: Date.now(), updatedBy: req.user.userId },
            { new: true }
        );
        if (!subcategory) return res.status(404).json({ message: 'Subcategory not found' });
        res.status(200).json({ message: 'Subcategory updated successfully', subcategory });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteSubcategory = async (req, res) => {
    try {
        const subcategory = await Subcategory.findById(req.params.id);

        if (subcategory.image) {
            fs.unlink(subcategory.image, (err) => {
                if (err) console.error('Error deleting image:', err);
            });
        }

        await Subcategory.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Subcategory deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteSubcategories = async (req, res) => {
    const { ids } = req.body;

    try {
        const subcategories = await Subcategory.find({ _id: { $in: ids } });

        for (const subcategory of subcategories) {
            if (subcategory.image) {
                fs.unlink(subcategory.image, (err) => {
                    if (err) console.error('Error deleting image:', err);
                });
            }
        }

        await Subcategory.deleteMany({ _id: { $in: ids } });

        res.status(200).json({ message: 'Subcategories deleted successfully' });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createSubcategory, getSubcategories, getSubcategoryBySlug, getSubcategoriesByCategory, updateSubcategory, deleteSubcategory, deleteSubcategories };