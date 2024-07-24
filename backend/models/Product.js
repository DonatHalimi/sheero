const mongoose = require('mongoose');
const Review = require('./Review');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    salePrice: { type: Number, default: null },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: true },
    subSubcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubSubcategory', required: true },
    image: { type: String, required: true },
    inventoryCount: { type: Number, default: 0 },
    dimensions: {
        length: { type: Number, default: null },
        width: { type: Number, default: null },
        height: { type: Number, default: null },
        unit: { type: String, default: 'cm' }
    },
    variants: [{
        color: String,
        size: String,
    }],
    discount: {
        type: {
            type: String,
            enum: ['percentage', 'fixed'],
            default: 'percentage'
        },
        value: { type: Number, default: 0 }
    },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    shipping: {
        weight: { type: Number, default: null },
        dimensions: {
            length: { type: Number, default: null },
            width: { type: Number, default: null },
            height: { type: Number, default: null },
            unit: { type: String, default: 'cm' }
        },
        cost: { type: Number, default: 0 },
        packageSize: {
            type: String,
            enum: ['small', 'medium', 'big'],
            default: 'medium'
        }
    },
    details: [{
        attribute: { type: String, default: null },
        value: { type: String, default: null }
    }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

productSchema.pre('save', function (next) {
    if (this.salePrice && this.price) {
        const discountPercentage = Math.round(((this.price - this.salePrice) / this.price) * 100);
        this.discount.value = discountPercentage;
    }
    next();
});

module.exports = mongoose.model('Product', productSchema);