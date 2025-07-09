const mongoose = require('mongoose');
const crypto = require('crypto');

const loginHistorySchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    ipAddress: { type: String, required: true },
    userAgent: { type: String, required: true },
    location: {
        country: { type: String, default: null },
        city: { type: String, default: null },
    },
    status: { type: String, enum: ['success', 'failed', '2fa_required'], default: 'success' },
    method: { type: String, enum: ['password', 'google', 'facebook', 'otp', 'authenticator'], required: true }
}, { _id: true });

const userSchema = new mongoose.Schema({
    googleId: { type: String, unique: true, sparse: true },
    facebookId: { type: String, unique: true, sparse: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    hasSetProfilePassword: { type: Boolean, default: false },
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
    loginHistory: [loginHistorySchema],
    lastLogin: { type: Date, default: null },
    loginCount: { type: Number, default: 0 },
    loginNotifications: { type: Boolean, default: true },
    deviceHistory: { type: Map, of: String, default: new Map() }
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

userSchema.methods.addLoginAttempt = async function (data) {
    const loginEntry = {
        timestamp: new Date(),
        ipAddress: data.ipAddress || '0.0.0.0',
        userAgent: data.userAgent || 'Unknown',
        location: {
            country: data.country || null,
            city: data.city || null,
        },
        status: data.status || 'success',
        method: data.method || 'password'
    };

    this.loginHistory.unshift(loginEntry);
    if (this.loginHistory.length > 50) {
        this.loginHistory = this.loginHistory.slice(0, 50);
    }

    if (data.status === 'success') {
        this.lastLogin = loginEntry.timestamp;
        this.loginCount += 1;

        const deviceInfo = `${data.userAgent || 'Unknown'}_${data.ipAddress || '0.0.0.0'}`;
        const deviceKey = crypto.createHash('md5').update(deviceInfo).digest('hex');

        this.deviceHistory.set(deviceKey, loginEntry.timestamp.toISOString());
    }

    return this.save();
};

module.exports = mongoose.model('User', userSchema);