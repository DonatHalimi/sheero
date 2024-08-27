const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contactInfo: {
        email: { type: String, required: true },
        phoneNumber: {
            type: String,
            validate: {
                validator: function (v) {
                    return /^0(44|45|48)\d{6}$/.test(v);
                },
                message: props => `${props.value} is not a valid phone number!`
            },
            required: [true, 'Phone number is required']
        },
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Supplier', supplierSchema);