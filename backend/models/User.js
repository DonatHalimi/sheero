const mongoose = require('mongoose');
const { JWT_SECRET } = require('../config/core/dotenv');

const userSchema = new mongoose.Schema({
    googleId: { type: String, unique: true, sparse: true },
    facebookId: { type: String, unique: true, sparse: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
    profilePicture: {
        type: String,
        default: function () {
            const color = '#7C7164';
            const letter = this.firstName.charAt(0).toUpperCase();
            return `https://dummyimage.com/100x100/${color.slice(1)}/ffffff&text=${letter}`;
        }
    },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorMethods: {
        type: [{
            type: String,
            enum: ['email', 'authenticator']
        }],
        default: []
    },
    twoFactorSecret: { type: String, default: null, select: false },
});

// Change profilePicture text on first name change
userSchema.pre('save', function (next) {
    if (this.isModified('firstName')) {
        const color = '#7C7164';
        const letter = this.firstName.charAt(0).toUpperCase();
        this.profilePicture = `https://dummyimage.com/100x100/${color.slice(1)}/ffffff&text=${letter}`;
    }
    next();
});

userSchema.methods.updateProfilePicture = async function (newPictureUrl) {
    this.profilePicture = newPictureUrl;
    await this.save();
};

// function for generateAccessToken to work in routes/auth.js
userSchema.methods.generateAccessToken = function () {
    const jwt = require('jsonwebtoken');
    return jwt.sign({
        userId: this._id,
        role: this.role,
    }, JWT_SECRET, { expiresIn: '7d' });
};

module.exports = mongoose.model('User', userSchema);