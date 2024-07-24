const mongoose = require('mongoose');

const subSubcategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SubSubcategory', subSubcategorySchema);