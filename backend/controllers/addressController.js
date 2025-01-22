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
        res.status(201).json({ message: 'Address created successfully', address });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getAddresses = async (req, res) => {
    try {
        const addresses = await Address.find()
            .populate('user', 'firstName lastName email')
            .populate('city', 'name zipCode')
            .populate('country', 'name');

        res.status(200).json(addresses);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getAddress = async (req, res) => {
    try {
        const address = await Address.findById(req.params.id)
            .populate('user', 'email')
            .populate('city', 'name zipCode')
            .populate('country', 'name');

        res.status(200).json(address);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getAddressByUser = async (req, res) => {
    const userId = req.params.userId;

    try {
        const address = await Address.findOne({ user: userId })
            .populate('city', 'name zipCode')
            .populate('country', 'name countryCode');

        res.status(200).json(address);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateAddress = async (req, res) => {
    const addressId = req.params.id;
    const { name, street, city, country, phoneNumber, comment } = req.body;

    try {
        const address = await Address.findOne({ _id: addressId, user: req.user.userId });

        const updatedAddress = await Address.findByIdAndUpdate(
            address._id,
            { name, street, city, country, phoneNumber, comment },
            { new: true, runValidators: true }
        );

        res.status(200).json({ message: 'Address updated succesfully', updatedAddress });
    } catch (error) {
        console.error('Error updating address:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteAddress = async (req, res) => {
    try {
        await Address.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
        console.error('Error deleting address:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteAddresses = async (req, res) => {
    const { ids } = req.body;

    try {
        await Address.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ message: 'Addresses deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createAddress, getAddresses, getAddress, getAddressByUser, updateAddress, deleteAddress, deleteAddresses };