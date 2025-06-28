const { NODE_ENV, JWT_SECRET, STRIPE_SECRET_KEY, JWT_REFRESH_SECRET } = require("./dotenv");
const jwt = require('jsonwebtoken');
const MemoryStore = require("../../models/MemoryStore");
const Stripe = require('stripe');
const otpGenerator = require('otp-generator');

const stripe = Stripe(STRIPE_SECRET_KEY);

const frontendUrl = NODE_ENV === 'production'
    ? 'https://sheero.onrender.com'
    : 'http://localhost:3000';

const shuffleOTP = (str) => str.split('').sort(() => Math.random() - 0.5).join('');

function generateCustomId() {
    return otpGenerator.generate(7, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false
    });
};

function generateOTP() {
    const letters = otpGenerator.generate(3, {
        digits: false,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: true,
        specialChars: false
    });

    const numbers = otpGenerator.generate(3, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false
    });

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