const mongoose = require('mongoose');

// Enum for predefined reasons
const returnReasons = [
    'Damaged Item',
    'Wrong Item Delivered',
    'Item Not as Described',
    'Changed My Mind',
    'Other'
];

function generateCustomId() {
    const timestamp = Date.now().toString().slice(-6);
    const randomPart = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return timestamp + randomPart;
}

const returnRequestSchema = new mongoose.Schema({
    _id: { type: String, default: generateCustomId },
    order: { type: String, required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, enum: returnReasons, required: true },
    customReason: { type: String, required: function () { return this.reason === 'Other'; }, minlength: 5, maxlength: 20 },
    status: { type: String, enum: ['pending', 'approved', 'processed', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

// Pre-save hook to ensure unique custom ID
returnRequestSchema.pre('save', async function (next) {
    if (this.isNew) {
        const exists = await this.constructor.findOne({ _id: this._id });
        if (exists) {
            this._id = generateCustomId();
        }
    }
    next();
});

module.exports = mongoose.model('ReturnRequest', returnRequestSchema);