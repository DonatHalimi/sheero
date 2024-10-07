const mongoose = require('mongoose');

// Custom ID generation function
function generateCustomId() {
    const timestamp = Date.now().toString().slice(-6);
    const randomPart = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return timestamp + randomPart;
}

const orderSchema = new mongoose.Schema({
    _id: { type: String, default: generateCustomId },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    paymentMethod: { type: String, enum: ['stripe', 'cash'], default: 'stripe' },
    paymentIntentId: { type: String, required: function() { return this.paymentMethod === 'stripe'; } },
    status: { type: String, enum: ['pending', 'shipped', 'delivered', 'canceled'], default: 'pending' },
    arrivalDateRange: {
        start: { type: Date, default: null },
        end: { type: Date, default: null }
    },
    createdAt: { type: Date, default: Date.now }
});

// Pre-save hook to set arrival date range
orderSchema.pre('save', function(next) {
    if (!this.arrivalDateRange.start && !this.arrivalDateRange.end) {
        const startDate = new Date(this.createdAt);
        const endDate = new Date(this.createdAt);

        startDate.setDate(startDate.getDate() + 7);
        endDate.setDate(endDate.getDate() + 11);

        this.arrivalDateRange.start = startDate;
        this.arrivalDateRange.end = endDate;
    }
    next();
});

// Pre-save hook to ensure unique custom ID
orderSchema.pre('save', async function(next) {
    if (this.isNew) {
        const exists = await this.constructor.findOne({ _id: this._id });
        if (exists) {
            this._id = generateCustomId();
        }
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);