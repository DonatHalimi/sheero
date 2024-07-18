const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
    name: { type: String, required: true },
    country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true },
    zipCode: { type: String, required: true }
});

module.exports = mongoose.model('City', citySchema);