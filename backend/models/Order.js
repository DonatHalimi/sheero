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
    paymentMethod: { type: String, enum: ['stripe'], default: 'stripe' },
    paymentIntentId: { type: String, required: true },
    status: { type: String, enum: ['pending', 'shipped', 'delivered', 'canceled'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

orderSchema.index({ _id: 1, createdAt: -1 });

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