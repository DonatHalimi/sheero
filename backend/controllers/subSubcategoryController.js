const SubSubcategory = require('../models/SubSubcategory');
const Product = require('../models/Product');

const createSubSubcategory = async (req, res) => {
    const { name, subcategory } = req.body;
    try {
        const subSubcategory = new SubSubcategory({ name, subcategory });
        await subSubcategory.save();
        res.status(201).json(subSubcategory);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getSubSubcategories = async (req, res) => {
    try {
        const subSubcategories = await SubSubcategory.find().populate('subcategory');
        res.status(200).json(subSubcategories);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getSubSubcategory = async (req, res) => {
    try {
        const subSubcategory = await SubSubcategory.findById(req.params.id).populate('subcategory');
        if (!subSubcategory) return res.status(404).json({ message: 'SubSubcategory not found' });
        res.status(200).json(subSubcategory);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getSubSubcategoriesBySubcategory = async (req, res) => {
    try {
        const subSubcategories = await SubSubcategory.find({ subcategory: req.params.subcategoryId });
        res.status(200).json(subSubcategories);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updateSubSubcategory = async (req, res) => {
    const { name, subcategory } = req.body;
    try {
        const subSubcategory = await SubSubcategory.findByIdAndUpdate(
            req.params.id,
            { name, subcategory, updatedAt: Date.now() },
            { new: true }
        );
        if (!subSubcategory) return res.status(404).json({ message: 'SubSubcategory not found' });
        res.status(200).json(subSubcategory);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteSubSubcategory = async (req, res) => {
    try {
        const subSubcategory = await SubSubcategory.findById(req.params.id);
        if (!subSubcategory) return res.status(404).json({ message: 'SubSubcategory not found' });

        // Check if there are products associated with this sub-subcategory
        const products = await Product.find({ subSubcategory: req.params.id });
        if (products.length > 0) {
            return res.status(400).json({ message: 'Cannot delete sub-subcategory with existing products' });
        }

        await SubSubcategory.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'SubSubcategory deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteSubSubcategories = async (req, res) => {
    const { subSubcategoryIds } = req.body;
    try {
        const subSubcategories = await SubSubcategory.find({ _id: { $in: subSubcategoryIds } });

        if (subSubcategories.length !== subSubcategoryIds.length) {
            return res.status(404).json({ message: 'One or more sub-subcategories not found' });
        }

        await SubSubcategory.deleteMany({ _id: { $in: subSubcategoryIds } });

        res.status(200).json({ message: 'SubSubcategories deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createSubSubcategory, getSubSubcategories, getSubSubcategory, getSubSubcategoriesBySubcategory, updateSubSubcategory, deleteSubSubcategory, deleteSubSubcategories };