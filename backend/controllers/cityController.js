const City = require('../models/City');

const createCity = async (req, res) => {
    const { name, country, zipCode } = req.body;
    try {
        const city = new City({ name, country, zipCode });
        await city.save();
        res.status(201).json(city);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getCities = async (req, res) => {
    try {
        const cities = await City.find().populate('country');
        res.status(200).json(cities);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getCity = async (req, res) => {
    try {
        const city = await City.findById(req.params.id).populate('country');
        if (!city) return res.status(404).json({ message: 'City not found' });
        res.status(200).json(city);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updateCity = async (req, res) => {
    const { name, country, zipCode } = req.body;
    try {
        const city = await City.findByIdAndUpdate(
            req.params.id,
            { name, country, zipCode, updatedAt: Date.now() },
            { new: true }
        );
        if (!city) return res.status(404).json({ message: 'City not found' });
        res.status(200).json(city);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteCity = async (req, res) => {
    try {
        const city = await City.findById(req.params.id);
        if (!city) {
            console.log(`City with id ${req.params.id} not found`);
            return res.status(404).json({ message: 'City not found' });
        }

        await City.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'City deleted successfully' });
    } catch (error) {
        console.error('Error deleting city:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteCities = async (req, res) => {
    const { cityIds } = req.body;
    try {
        const cities = await City.find({ _id: { $in: cityIds } });

        if (cities.length !== cityIds.length) {
            return res.status(404).json({ message: 'One or more cities not found' });
        }

        await City.deleteMany({ _id: { $in: cityIds } });

        res.status(200).json({ message: 'Cities deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getCitiesByCountry = async (req, res) => {
    try {
        const { countryId } = req.params;
        const cities = await City.find({ country: countryId }).populate('country');
        res.status(200).json(cities);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createCity, getCities, getCity, updateCity, deleteCity, getCitiesByCountry, deleteCities };