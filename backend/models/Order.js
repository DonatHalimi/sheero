const mongoose = require('mongoose');

// Custom ID generation function
function generateCustomId() {
    const timestamp = Date.now().toString().slice(-5);
    const randomPart = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return timestamp + randomPart;
};

const paymentStatus = ['pending', 'completed', 'failed'];
const paymentMethod = ['stripe', 'cash'];
const status = ['pending', 'processed', 'shipped', 'delivered', 'canceled'];

const orderSchema = new mongoose.Schema({
    _id: { type: String, default: generateCustomId },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        previousInventory: { type: Number },
        updatedInventory: { type: Number },
        inventoryUpdated: { type: Boolean, default: false }
    }],
    address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: paymentStatus, default: 'pending' },
    paymentMethod: { type: String, enum: paymentMethod, default: 'stripe' },
    paymentIntentId: { type: String, required: function () { return this.paymentMethod === 'stripe'; } },
    status: { type: String, enum: status, default: 'pending' },
    arrivalDateRange: {
        start: { type: Date, default: null },
        end: { type: Date, default: null }
    },
    createdAt: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

// Pre-save hook to set arrival date range
orderSchema.pre('save', function (next) {
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
orderSchema.pre('save', async function (next) {
    if (this.isNew) {
        const exists = await this.constructor.findOne({ _id: this._id });
        if (exists) {
            this._id = generateCustomId();
        }
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);