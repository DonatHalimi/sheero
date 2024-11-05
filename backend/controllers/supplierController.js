const Supplier = require('../models/Supplier');

const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
};

const createSupplier = async (req, res) => {
    const { name, contactInfo } = req.body;

    if (!name || !contactInfo || !contactInfo.email || !contactInfo.phoneNumber) {
        return res.status(400).json({ message: 'Please fill in all the fields' })
    }

    if (!validateEmail(contactInfo.email)) {
        return res.status(400).json({ message: 'Email format is not correct' });
    }

    try {
        const supplier = new Supplier({ name, contactInfo });
        await supplier.save();
        res.status(201).json({ message: 'Supplier created succesfully', supplier });
    } catch (error) {
        console.error('Error creating supplier:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation error', error: error.message });
        }
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
        res.status(200).json({ message: 'Supplier updated succesfully', supplier });
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

const deleteSuppliers = async (req, res) => {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'Invalid or empty ids array' });
    }

    try {
        const suppliers = await Supplier.find({ _id: { $in: ids } });

        if (suppliers.length !== ids.length) {
            return res.status(404).json({ message: 'One or more suppliers not found' });
        }

        await Supplier.deleteMany({ _id: { $in: ids } });

        res.status(200).json({ message: 'Suppliers deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createSupplier, getSuppliers, getSupplier, updateSupplier, deleteSupplier, deleteSuppliers };