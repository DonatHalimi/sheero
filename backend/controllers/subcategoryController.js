const Subcategory = require('../models/Subcategory');
const Product = require('../models/Product');
const Subsubcategory = require('../models/SubSubcategory')
const fs = require('fs');
const path = require('path');

const createSubcategory = async (req, res) => {
    const { name, category } = req.body;
    const image = req.file ? req.file.path : '';

    if (!category) {
        return res.status(400).json({ message: 'Category is required' });
    }

    if (!image || !req.file) {
        return res.status(400).json({ message: 'Image is required' });
    }

    try {
        const subcategory = new Subcategory({ name, category, image });
        await subcategory.save();
        res.status(201).json(subcategory);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getSubcategories = async (req, res) => {
    try {
        const subcategories = await Subcategory.find().populate('category');
        if (!subcategories) return res.status(404).json({ message: 'Subcategories not found' });
        res.status(200).json(subcategories);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getSubcategory = async (req, res) => {
    try {
        const subcategory = await Subcategory.findById(req.params.id).populate('category');
        if (!subcategory) return res.status(404).json({ message: 'Subcategory not found' });
        res.status(200).json(subcategory);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getSubcategoriesByCategory = async (req, res) => {
    try {
        const subcategories = await Subcategory.find({ category: req.params.categoryId });
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
        if (!oldSubcategory) return res.status(404).json({ message: 'Subcategory not found' });

        if (req.file) {
            // If a new file is uploaded, delete the old one
            if (oldSubcategory.image) {
                fs.unlink(oldSubcategory.image, (err) => {
                    if (err) console.error('Error deleting old image:', err);
                });
            }
            image = req.file.path;
        } else if (image === null || image === '') {
            // If image is set to null or empty string, delete the old image
            if (oldSubcategory.image) {
                fs.unlink(oldSubcategory.image, (err) => {
                    if (err) console.error('Error deleting old image:', err);
                });
            }
            image = '';
        }

        const subcategory = await Subcategory.findByIdAndUpdate(
            req.params.id,
            { name, image, category, updatedAt: Date.now() },
            { new: true }
        );
        if (!subcategory) return res.status(404).json({ message: 'Subcategory not found' });
        res.status(200).json(subcategory);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteSubcategory = async (req, res) => {
    try {
        const subcategory = await Subcategory.findById(req.params.id);
        if (!subcategory) return res.status(404).json({ message: 'Subcategory not found' });

        // Check if there are products associated with this subcategory
        const products = await Product.find({ subcategory: req.params.id });
        if (products.length > 0) {
            return res.status(400).json({ message: 'Cannot delete subcategory with existing products' });
        }

        // Check if there are subcategories associated with this category
        const subsubcategories = await Subsubcategory.find({ category: req.params.id });
        if (subsubcategories.length > 0) {
            return res.status(400).json({ message: 'Cannot delete subcategory with existing subsubcategories' });
        }

        // Delete the image file if it exists
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
    const { subcategoryIds } = req.body;
    try {
        const subcategories = await Subcategory.find({ _id: { $in: subcategoryIds } });

        if (subcategories.length !== subcategoryIds.length) {
            return res.status(404).json({ message: 'One or more subcategories not found' });
        }

        for (const subcategory of subcategories) {
            const products = await Product.find({ subcategory: req.params.id });
            if (products.length > 0) {
                return res.status(400).json({ message: `Cannot delete subcategory ${subcategory.name} with existing products` });
            }

            const subSubcategories = await Subsubcategory.find({ subcategory: req.params.id });
            if (subSubcategories.length > 0) {
                return res.status(400).json({ message: `Cannot delete subcategory ${subcategory.name} with existing subSubcategories` });
            }

            if (subcategory.image) {
                fs.unlink(subcategory.image, (err) => {
                    if (err) console.error('Error deleting image:', err);
                });
            }
        }

        await Subcategory.deleteMany({ _id: { $in: subcategoryIds } });

        res.status(200).json({ message: 'Subcategories deleted successfully' });
    } catch (error) {
        console.error('Error deleting subcategories:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createSubcategory, getSubcategories, getSubcategory, getSubcategoriesByCategory, updateSubcategory, deleteSubcategory, deleteSubcategories };