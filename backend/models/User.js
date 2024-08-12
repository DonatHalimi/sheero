const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['user', 'admin'], default: 'user' },
    address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' }
});

module.exports = mongoose.model('User', userSchema);