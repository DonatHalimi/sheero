const Country = require('../models/Country');
const City = require('../models/City');

const createCountry = async (req, res) => {
    const { name } = req.body;
    try {
        const country = new Country({ name });
        await country.save();
        res.status(201).json(country);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getCountries = async (req, res) => {
    try {
        const countries = await Country.find();
        res.status(200).json(countries);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getCountry = async (req, res) => {
    try {
        const country = await Country.findById(req.params.id);
        if (!country) return res.status(404).json({ message: 'Country not found' });
        res.status(200).json(country);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updateCountry = async (req, res) => {
    const { name } = req.body;
    try {
        const country = await Country.findByIdAndUpdate(
            req.params.id,
            { name, updatedAt: Date.now() },
            { new: true }
        );
        if (!country) return res.status(404).json({ message: 'Country not found' });
        res.status(200).json(country);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteCountry = async (req, res) => {
    try {
        const country = await Country.findById(req.params.id);
        if (!country) {
            console.log(`Country with id ${req.params.id} not found`);
            return res.status(404).json({ message: 'Country not found' });
        }

        await Country.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Country deleted successfully' });
    } catch (error) {
        console.error('Error deleting country:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteCountries = async (req, res) => {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'Invalid or empty ids array' });
    }
    
    try {
        const countries = await Country.find({ _id: { $in: ids } });

        if (countries.length !== ids.length) {
            return res.status(404).json({ message: 'One or more countries not found' });
        }

        for (const country of countries) {
            await City.deleteMany({ country: country._id });
        }

        await Country.deleteMany({ _id: { $in: ids } });

        res.status(200).json({ message: 'Countries and associated cities deleted successfully' });
    } catch (error) {
        console.error('Error deleting countries:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createCountry, getCountries, getCountry, updateCountry, deleteCountry, deleteCountries };