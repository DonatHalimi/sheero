const Subcategory = require('../models/Subcategory');
const Product = require('../models/Product');

const createSubcategory = async (req, res) => {
    const { name, category } = req.body;
    try {
        const subcategory = new Subcategory({ name, category });
        await subcategory.save();
        res.status(201).json(subcategory);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getSubcategories = async (req, res) => {
    try {
        const subcategories = await Subcategory.find().populate('category');
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
    try {
        const subcategory = await Subcategory.findByIdAndUpdate(
            req.params.id,
            { name, category, updatedAt: Date.now() },
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

        await Subcategory.deleteMany({ _id: { $in: subcategoryIds } });

        res.status(200).json({ message: 'Subcategories deleted successfully' });
    } catch (error) {
        console.error('Error deleting subcategories:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createSubcategory, getSubcategories, getSubcategory, getSubcategoriesByCategory, updateSubcategory, deleteSubcategory, deleteSubcategories };