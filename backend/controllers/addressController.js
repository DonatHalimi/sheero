const Address = require('../models/Address');

const createAddress = async (req, res) => {
    const { name, street, city, country } = req.body;
    try {
        // Check if the user already has an address
        const existingAddress = await Address.findOne({ user: req.user.userId });

        if (existingAddress) {
            return res.status(400).json({ message: 'You already have an address. Please update it instead.' });
        }

        // Create a new address
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

const getUserAddress = async (req, res) => {
    try {
        const address = await Address.findOne({ user: req.user.userId })
            .populate('city', 'name zipCode')
            .populate('country', 'name');

        if (!address) {
            return res.status(404).json({ message: 'No address found for the current user' });
        }

        res.status(200).json(address);
    } catch (error) {
        console.error('Error fetching user address:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateAddress = async (req, res) => {
    const addressId = req.params.id;
    const updates = req.body;

    try {
        // Find the address by ID and ensure it belongs to the current user
        const address = await Address.findOne({ _id: addressId, user: req.user.userId });

        if (!address) {
            return res.status(404).json({ message: 'Address not found or does not belong to the user' });
        }

        // Update the existing address
        const updatedAddress = await Address.findByIdAndUpdate(address._id, updates, { new: true, runValidators: true });

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
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'Invalid or empty ids array' });
    }

    try {
        const addresses = await Address.find({ _id: { $in: ids } });

        if (addresses.length !== ids.length) {
            return res.status(404).json({ message: 'One or more addresses not found' });
        }

        await Address.deleteMany({ _id: { $in: ids } });

        res.status(200).json({ message: 'Addresses deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createAddress, getAddresses, getAddress, getUserAddress, updateAddress, deleteAddress, deleteAddresses };
