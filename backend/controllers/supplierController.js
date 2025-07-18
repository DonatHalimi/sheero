const Supplier = require('../models/Supplier');

const createSupplier = async (req, res) => {
    const { name, contactInfo } = req.body;

    try {
        const supplier = new Supplier({ name, contactInfo, createdBy: req.user.userId });
        await supplier.save();
        res.status(201).json({ success: true, message: 'Supplier created successfully', supplier });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating supplier', error: error.message });
    }
};

const getSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find()
            .populate('createdBy', 'firstName lastName email')
            .populate('updatedBy', 'firstName lastName email');
        res.status(200).json(suppliers);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error getting suppliers', error: error.message });
    }
};

const getSupplierById = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
        res.status(200).json(supplier);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error getting supplier', error: error.message });
    }
};

const updateSupplier = async (req, res) => {
    const { name, contactInfo } = req.body;
    try {
        const supplier = await Supplier.findByIdAndUpdate(
            req.params.id,
            { name, contactInfo, updatedAt: Date.now(), updatedBy: req.user.userId },
            { new: true, runValidators: true }
        );

        res.status(200).json({ success: true, message: 'Supplier updated successfully', supplier });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating supplier', error: error.message });
    }
};

const deleteSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findByIdAndDelete(req.params.id);
        if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
        res.status(200).json({ success: true, message: 'Supplier deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting supplier', error: error.message });
    }
};

const deleteSuppliers = async (req, res) => {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'Invalid or empty ids array' });
    }

    try {
        const suppliers = await Supplier.find({ _id: { $in: ids } });

        if (suppliers.length !== ids.length) return res.status(404).json({ message: 'One or more suppliers not found' });

        await Supplier.deleteMany({ _id: { $in: ids } });

        res.status(200).json({ success: true, message: 'Suppliers deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting suppliers', error: error.message });
    }
};

module.exports = { createSupplier, getSuppliers, getSupplierById, updateSupplier, deleteSupplier, deleteSuppliers };