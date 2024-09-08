const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, default: 1 },
    }],
    totalPrice: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

cartSchema.methods.calculateTotalPrice = async function () {
    await this.populate('items.product');

    this.totalPrice = this.items.reduce((total, item) => {
        return total + item.quantity * item.product.price;
    }, 0);

    return this.totalPrice;
};

module.exports = mongoose.model('Cart', cartSchema);