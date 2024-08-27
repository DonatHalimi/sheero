const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
    name: { type: String, required: true },
    street: { type: String, required: true },
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
    city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
    country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Address', addressSchema);