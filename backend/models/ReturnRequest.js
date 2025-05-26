const mongoose = require('mongoose');

// Enum for predefined reasons
const reasons = [
    'Damaged Item',
    'Wrong Item Delivered',
    'Item Not as Described',
    'Changed My Mind',
    'Other'
];

const status = ['pending', 'approved', 'processed', 'rejected'];

function generateCustomId() {
    const timestamp = Date.now().toString().slice(-5);
    const randomPart = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return timestamp + randomPart;
};

const returnRequestSchema = new mongoose.Schema({
    _id: { type: String, default: generateCustomId },
    order: { type: String, required: true }, // not order reference since order id format is custom
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, enum: reasons, required: true },
    customReason: { type: String, required: function () { return this.reason === 'Other'; } },
    status: { type: String, enum: status, default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
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