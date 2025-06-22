const Address = require('../models/Address');

const createAddress = async (req, res) => {
    const { name, street, city, country, phoneNumber, comment } = req.body;

    try {
        const address = new Address({
            user: req.user.userId,
            name,
            street,
            city,
            country,
            phoneNumber,
            comment
        });

        await address.save();

        res.status(201).json({ success: true, message: 'Address created successfully', address });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating address', error: error.message });
    }
};

const getAddresses = async (req, res) => {
    try {
        const addresses = await Address.find()
            .populate('user', 'firstName lastName email')
            .populate('city', 'name zipCode')
            .populate('country', 'name countryCode');

        res.status(200).json(addresses);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error getting addresses', error: error.message });
    }
};

const getAddress = async (req, res) => {
    try {
        const address = await Address.findById(req.params.id)
            .populate('user', 'email')
            .populate('city', 'name zipCode')
            .populate('country', 'name countryCode');

        res.status(200).json(address);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error getting address', error: error.message });
    }
};

const getUserAddress = async (req, res) => {
    const userId = req.params.userId;

    try {
        const address = await Address.findOne({ user: userId })
            .populate('city', 'name zipCode')
            .populate('country', 'name countryCode');

        res.status(200).json(address);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error getting user address', error: error.message });
    }
};

const updateAddress = async (req, res) => {
    const addressId = req.params.id;
    const { userId, role } = req.user;

    try {
        const address = await Address.findById(addressId);
        if (!address) return res.status(404).json({ success: false, message: 'Address not found' });

        const isOwner = address.user.toString() === userId;
        const isAdmin = role?.name === 'admin';

        if (!isOwner && !isAdmin) return res.status(403).json({ success: false, message: 'Unauthorized to update this address' });

        const updatedAddress = await Address.findByIdAndUpdate(addressId, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, message: 'Address updated successfully', updatedAddress });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating address', error: error.message });
    }
};

const deleteAddress = async (req, res) => {
    try {
        await Address.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Address deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting address', error: error.message });
    }
};

const deleteAddresses = async (req, res) => {
    const { ids } = req.body;

    try {
        await Address.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ success: true, message: 'Addresses deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting addresses', error: error.message });
    }
};

module.exports = { createAddress, getAddresses, getAddress, getUserAddress, updateAddress, deleteAddress, deleteAddresses };