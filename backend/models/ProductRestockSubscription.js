const mongoose = require('mongoose');

const productRestockSubscriptionSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    email: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ProductRestockSubscription', productRestockSubscriptionSchema);