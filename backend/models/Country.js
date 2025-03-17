const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    countryCode: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Country', countrySchema);