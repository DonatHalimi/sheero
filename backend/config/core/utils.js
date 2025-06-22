const { NODE_ENV, JWT_SECRET, STRIPE_SECRET_KEY, JWT_REFRESH_SECRET } = require("./dotenv");
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const MemoryStore = require("../../models/MemoryStore");
const Stripe = require('stripe');

const stripe = Stripe(STRIPE_SECRET_KEY);

const frontendUrl = NODE_ENV === 'production'
    ? 'https://sheero.onrender.com'
    : 'http://localhost:3000';

const shuffleOTP = (str) => str.split('').sort(() => Math.random() - 0.5).join('');

function generateCustomId() {
    const timestamp = Date.now().toString().slice(-5);
    const randomPart = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return timestamp + randomPart;
};

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

const generateAccessToken = (userId) => {
    return jwt.sign({
        userId: userId
    }, JWT_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (userId) => {
    return jwt.sign({
        userId: userId
    }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

const verificationCodeStore = new MemoryStore();
const pendingUsersStore = new MemoryStore();
const rateLimitStore = new MemoryStore();
const twoFactorRateLimitStore = new MemoryStore();
const twoFactorOtpStore = new MemoryStore();

module.exports = {
    stripe, frontendUrl, generateCustomId, generateOTP, generateAccessToken, generateRefreshToken,
    verificationCodeStore, pendingUsersStore, rateLimitStore, twoFactorRateLimitStore, twoFactorOtpStore
};