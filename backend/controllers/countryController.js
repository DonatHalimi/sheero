const Country = require('../models/Country');
const City = require('../models/City');

const createCountry = async (req, res) => {
    const { name } = req.body;

    try {
        const country = new Country({ name });
        await country.save();
        res.status(201).json({ message: 'Country created succesfully', country });
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

const getCountryById = async (req, res) => {
    try {
        const country = await Country.findById(req.params.id);
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
        res.status(200).json({ message: 'Country updated succesfully', country });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteCountry = async (req, res) => {
    try {
        await Country.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Country deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteCountries = async (req, res) => {
    const { ids } = req.body;

    try {
        const countries = await Country.find({ _id: { $in: ids } });

        for (const country of countries) {
            await City.deleteMany({ country: country._id });
        }

        await Country.deleteMany({ _id: { $in: ids } });

        res.status(200).json({ message: 'Countries and associated cities deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createCountry, getCountries, getCountryById, updateCountry, deleteCountry, deleteCountries };