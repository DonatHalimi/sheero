const Address = require('../models/Address');

const createAddress = async (req, res) => {
    const { name, street, city, country } = req.body;
    try {
        const address = new Address({
            user: req.user.userId,
            name,
            street,
            city,
            country
        });
        await address.save();
        res.status(201).json(address);
    } catch (error) {
        console.error('Error creating address:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAddresses = async (req, res) => {
    try {
        const addresses = await Address.find()
            .populate('user', 'username')
            .populate('city', 'name zipCode')
            .populate('country', 'name');
        res.status(200).json(addresses);
    } catch (error) {
        console.error('Error fetching addresses:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAddress = async (req, res) => {
    try {
        const address = await Address.findById(req.params.id)
            .populate('user', 'username')
            .populate('city', 'name zipCode')
            .populate('country', 'name');

        res.status(200).json(address);
    } catch (error) {
        console.error('Error fetching address:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateAddress = async (req, res) => {
    const updates = req.body;

    try {
        const address = await Address.findById(req.params.id);

        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        if (address.user.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const updatedAddress = await Address.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });

        res.status(200).json(updatedAddress);
    } catch (error) {
        console.error('Error updating address:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteAddress = async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        await Address.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
        console.error('Error deleting address:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteAddresses = async (req, res) => {
    const { addressIds } = req.body;
    try {
        const addresses = await Address.find({ _id: { $in: addressIds } });

        if (addresses.length !== addressIds.length) {
            return res.status(404).json({ message: 'One or more addresses not found' });
        }

        await Address.deleteMany({ _id: { $in: addressIds } });

        res.status(200).json({ message: 'Addresses deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createAddress, getAddresses, getAddress, updateAddress, deleteAddress, deleteAddresses };
