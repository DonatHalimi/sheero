const { NODE_ENV, JWT_SECRET, STRIPE_SECRET_KEY } = require("./dotenv");
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const MemoryStore = require("../../models/MemoryStore");
const Stripe = require('stripe');

const stripe = Stripe(STRIPE_SECRET_KEY);

const frontendUrl = NODE_ENV === 'production'
    ? 'https://sheero.onrender.com'
    : 'http://localhost:3000';

const shuffleOTP = (str) => str.split('').sort(() => Math.random() - 0.5).join('');

const generateOTP = () => {
    const secret = speakeasy.generateSecret({ length: 20 }).base32;
    const token = speakeasy.totp({
        secret,
        encoding: 'base32',
        digits: 3
    });

    const numbers = token.padStart(3, '0');
    const letters = Array.from({ length: 3 }, () =>
        String.fromCharCode(65 + Math.floor(Math.random() * 26))
    ).join('');

    return shuffleOTP(letters + numbers);
};

const generateAccessToken = (user) => {
    return jwt.sign({
        userId: user._id,
        role: user.role
    }, JWT_SECRET, { expiresIn: '7d' });
};

const verificationCodeStore = new MemoryStore();
const pendingUsersStore = new MemoryStore();
const rateLimitStore = new MemoryStore();
const twoFactorRateLimitStore = new MemoryStore();
const twoFactorOtpStore = new MemoryStore();

module.exports = {
    stripe, frontendUrl, generateOTP, generateAccessToken, verificationCodeStore,
    pendingUsersStore, rateLimitStore, twoFactorRateLimitStore, twoFactorOtpStore
};