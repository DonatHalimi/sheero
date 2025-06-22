const Country = require('../models/Country');
const City = require('../models/City');

const createCountry = async (req, res) => {
    const { name, countryCode } = req.body;

    try {
        const country = new Country({ name, countryCode, createdBy: req.user.userId });
        await country.save();
        res.status(201).json({ success: true, message: 'Country created successfully', country });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating country', error: error.message });
    }
};

const getCountries = async (req, res) => {
    try {
        const countries = await Country.find()
            .populate('createdBy', 'firstName lastName email')
            .populate('updatedBy', 'firstName lastName email');
        res.status(200).json(countries);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error getting countries', error: error.message });
    }
};

const getCountryById = async (req, res) => {
    try {
        const country = await Country.findById(req.params.id);
        res.status(200).json(country);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error getting country', error: error.message });
    }
};

const updateCountry = async (req, res) => {
    const { name, countryCode } = req.body;

    try {
        const country = await Country.findByIdAndUpdate(
            req.params.id,
            { name, countryCode, updatedAt: Date.now(), updatedBy: req.user.userId },
            { new: true }
        );
        res.status(200).json({ success: true, message: 'Country updated successfully', country });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating country', error: error.message });
    }
};

const deleteCountry = async (req, res) => {
    try {
        await Country.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Country deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting country', error: error.message });
    }
};

const deleteCountries = async (req, res) => {
    const { ids } = req.body;

    try {
        const countries = await Country.find({ _id: { $in: ids } });

        for (const country of countries) {
            const cities = await City.find({ country: country._id });

            if (cities.length > 0) return res.status(400).json({ message: `Cannot delete country '${country.name}' as it has associated cities` });
        }

        await Country.deleteMany({ _id: { $in: ids } });

        res.status(200).json({ success: true, message: 'Countries deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting countries', error: error.message });
    }
};

module.exports = { createCountry, getCountries, getCountryById, updateCountry, deleteCountry, deleteCountries };