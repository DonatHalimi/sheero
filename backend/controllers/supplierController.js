const Supplier = require('../models/Supplier');

const createSupplier = async (req, res) => {
    const { name, contactInfo } = req.body;
    try {
        const supplier = new Supplier({ name, contactInfo });
        await supplier.save();
        res.status(201).json(supplier);
    } catch (error) {
        console.error('Error creating supplier:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find();
        res.status(200).json(suppliers);
    } catch (error) {
        console.error('Error getting suppliers:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
        res.status(200).json(supplier);
    } catch (error) {
        console.error('Error getting supplier:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateSupplier = async (req, res) => {
    const { name, contactInfo } = req.body;
    try {
        const supplier = await Supplier.findByIdAndUpdate(
            req.params.id,
            { name, contactInfo, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
        if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
        res.status(200).json(supplier);
    } catch (error) {
        console.error('Error updating supplier:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findByIdAndDelete(req.params.id);
        if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
        res.status(200).json({ message: 'Supplier deleted successfully' });
    } catch (error) {
        console.error('Error deleting supplier:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createSupplier, getSuppliers, getSupplier, updateSupplier, deleteSupplier };