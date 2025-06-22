const City = require('../models/City');

const createCity = async (req, res) => {
    const { name, country, zipCode } = req.body;

    try {
        const city = new City({ name, country, zipCode, createdBy: req.user.userId });

        await city.save();
        res.status(201).json({ success: true, message: 'City created successfully', city });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating city', error: error.message });
    }
};

const getCities = async (req, res) => {
    try {
        const cities = await City.find()
            .populate('country')
            .populate('createdBy', 'firstName lastName email')
            .populate('updatedBy', 'firstName lastName email');
        res.status(200).json(cities);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error getting cities', error: error.message });
    }
};

const getCityById = async (req, res) => {
    try {
        const city = await City.findById(req.params.id).populate('country');
        res.status(200).json(city);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error getting city', error: error.message });
    }
};

const updateCity = async (req, res) => {
    const { name, country, zipCode } = req.body;

    try {
        const city = await City.findByIdAndUpdate(
            req.params.id,
            { name, country, zipCode, updatedAt: Date.now(), updatedBy: req.user.userId },
            { new: true }
        );
        res.status(200).json({ success: true, message: 'City updated successfully', city });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating city', error: error.message });
    }
};

const deleteCity = async (req, res) => {
    try {
        await City.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'City deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting city', error: error.message });
    }
};

const deleteCities = async (req, res) => {
    const { ids } = req.body;

    try {
        await City.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ success: true, message: 'Cities deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting cities', error: error.message });
    }
};

const getCitiesByCountry = async (req, res) => {
    const { countryId } = req.params;

    try {
        const cities = await City.find({ country: countryId }).populate('country');
        res.status(200).json(cities);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error getting cities by country', error: error.message });
    }
};

module.exports = { createCity, getCities, getCityById, updateCity, deleteCity, getCitiesByCountry, deleteCities };