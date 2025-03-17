const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
const cookieConfig = require('../config/cookie');
const crypto = require('crypto');
const { JWT_SECRET } = require('../config/dotenv');
const { sendVerificationEmail, sendResetPasswordEmail, sendPasswordResetSuccessEmail, sendEnable2FAEmail, sendDisable2FAEmail, sendLogin2FAEmail } = require('../config/emailService');
const MemoryStore = require('../models/MemoryStore');

const shuffleOTP = (str) => str.split('').sort(() => Math.random() - 0.5).join('');

const generateOTP = () => {
    const numbers = '0123456789';
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let otp = '';

    for (let i = 0; i < 3; i++) {
        otp += letters[Math.floor(Math.random() * letters.length)];
        otp += numbers[Math.floor(Math.random() * numbers.length)];
    }

    return shuffleOTP(otp);
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

const registerUser = async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const validRole = await Role.findById(role) || await Role.findOne({ name: 'user' });

        pendingUsersStore.set(email, {
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: validRole._id,
            createdAt: Date.now()
        });

        const otp = generateOTP();
        verificationCodeStore.set(email, otp, 5 * 60 * 1000);

        await sendVerificationEmail(email, otp);

        res.status(201).json({ message: `OTP code sent to ${email}. Please check your inbox`, email });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const verifyOTP = async (req, res) => {
    const { email, otp: userOtp } = req.body;

    if (!email || !userOtp) return res.status(400).json({ error: 'Email and OTP are required' });

    const storedOtp = verificationCodeStore.get(email);

    if (!storedOtp) return res.status(400).json({ error: "Invalid or expired OTP. Please request a new one" });

    if (storedOtp !== userOtp) return res.status(400).json({ error: 'Invalid OTP. Please try again' });

    try {
        const pendingUser = pendingUsersStore.get(email);
        if (!pendingUser) return res.status(400).json({ error: 'No pending registration found for this email' });

        const newUser = new User(pendingUser);
        await newUser.save();

        pendingUsersStore.delete(email);
        verificationCodeStore.delete(email);

        const user = await User.findById(newUser._id).populate('role');

        const accessToken = generateAccessToken(user);
        res.cookie('accessToken', accessToken, cookieConfig);

        res.status(200).json({
            success: true,
            message: "Email verified and logged in successfully",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role.name,
                accessToken: accessToken
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const resendOTP = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required.' });

    try {
        const currentTime = Date.now();
        const rateLimitDuration = 60 * 1000;
        const lastRequestTime = rateLimitStore.get(email);

        if (lastRequestTime && currentTime - lastRequestTime < rateLimitDuration) {
            const waitTime = Math.ceil((rateLimitDuration - (currentTime - lastRequestTime)) / 1000);
            return res.status(429).json({ error: `Too many requests. Please wait ${waitTime} seconds before trying again` });
        }

        const existingOtp = verificationCodeStore.get(email);
        if (!existingOtp) return res.status(400).json({ error: 'No OTP found for this email. Please register first' });

        const newOtp = generateOTP();
        verificationCodeStore.set(email, newOtp, 10 * 60 * 1000);

        rateLimitStore.set(email, currentTime);
        await sendVerificationEmail(email, newOtp);

        res.status(200).json({ message: `OTP re-sent to ${email}. Please check your inbox` });
    } catch (error) {
        res.status(500).json({ message: 'Failed to resend OTP', error: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email }).populate('role');

        if (user.twoFactorEnabled) {
            const newOtp = generateOTP();
            twoFactorOtpStore.set(email, newOtp.toString(), 10 * 60 * 1000);

            await sendLogin2FAEmail(email, newOtp);

            return res.status(200).json({
                success: true,
                message: `OTP code sent to ${email} for two-factor authentication. Please verify to complete login`,
                email: email,
                requires2FA: true
            });
        }

        const accessToken = generateAccessToken(user);
        res.cookie('accessToken', accessToken, cookieConfig);

        return res.status(200).json({
            success: true,
            message: "Successfully logged in",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role.name,
                accessToken: accessToken
            }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const sendOTPForTwoFactor = async (user, action, isResend = false) => {
    const newOtp = generateOTP();
    twoFactorOtpStore.set(user.email, newOtp.toString(), 10 * 60 * 1000);

    const actionMessages = {
        enable: `OTP code ${isResend ? 'resent' : 'sent'} to ${user.email}. Please verify to enable two-factor authentication`,
        disable: `OTP code ${isResend ? 'resent' : 'sent'} to ${user.email}. Please verify to disable two-factor authentication`,
        login: `OTP code ${isResend ? 'resent' : 'sent'} to ${user.email}. Please verify your login using the OTP`
    };

    switch (action) {
        case 'enable':
            await sendEnable2FAEmail(user.email, newOtp);
            break;
        case 'disable':
            await sendDisable2FAEmail(user.email, newOtp);
            break;
        case 'login':
            await sendLogin2FAEmail(user.email, newOtp);
            break;
        default:
            throw new Error("Invalid action for sending OTP");
    }

    return { message: actionMessages[action], otp: newOtp };
};

const enable2FA = async (req, res) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized. User not found' });

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (user.twoFactorEnabled) return res.status(400).json({ message: 'Two-factor authentication is already enabled' });

    try {
        const result = await sendOTPForTwoFactor(user, 'enable');
        res.status(200).json({
            success: true,
            message: result.message,
            email: user.email
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

const disable2FA = async (req, res) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized. User not found' });

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (!user.twoFactorEnabled) return res.status(400).json({ message: 'Two-factor authentication is already disabled' });

    try {
        const result = await sendOTPForTwoFactor(user, 'disable');
        res.status(200).json({
            success: true,
            message: result.message,
            email: user.email,
            disableOtpPending: true
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const resend2FAOTP = async (req, res) => {
    let { action, email } = req.body;
    let user;

    try {
        if (!email && req.user) {
            user = await User.findById(req.user.userId);
            if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
            email = user.email;
        }

        if (!email) return res.status(400).json({ success: false, message: 'Email is required.' });

        const currentTime = Date.now();
        const rateLimitDuration = 60 * 1000;
        const lastRequestTime = twoFactorRateLimitStore.get(email);

        if (lastRequestTime && currentTime - lastRequestTime < rateLimitDuration) {
            const waitTime = Math.ceil((rateLimitDuration - (currentTime - lastRequestTime)) / 1000);
            return res.status(429).json({ success: false, message: `Too many requests. Please wait ${waitTime} seconds before trying again.` });
        }

        if (action === 'login') {
            user = await User.findOne({ email });
            if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

            if (!user.twoFactorEnabled) return res.status(400).json({ success: false, message: 'Two-factor authentication is not enabled for this account.' });

        } else {
            if (!user) {
                user = await User.findById(req.user.userId);
                if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
            }

            if (action === 'enable' && user.twoFactorEnabled) return res.status(400).json({ success: false, message: 'Two-factor authentication is already enabled.' });

            if (action === 'disable' && !user.twoFactorEnabled) return res.status(400).json({ success: false, message: 'Two-factor authentication is already disabled.' });
        }

        const result = await sendOTPForTwoFactor(user, action, true);
        twoFactorRateLimitStore.set(email, currentTime);

        res.status(200).json({
            success: true,
            message: result.message,
            email: user.email,
            action: action
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const verifyTwoFactorOTP = async (req, res) => {
    const { email, otp, action } = req.body;

    if (!email || !otp || !action) return res.status(400).json({ message: 'Email, OTP, and action are required' });

    const storedOtp = twoFactorOtpStore.get(email);

    if (!storedOtp) return res.status(400).json({ message: "No OTP request found. Please try again" });

    if (storedOtp.toString() !== otp.toString()) return res.status(400).json({ message: "Invalid OTP" });

    twoFactorOtpStore.delete(email);

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        switch (action) {
            case 'enable':
                user.twoFactorEnabled = true;
                await user.save();
                return res.status(200).json({
                    success: true,
                    message: "Two-factor authentication has been enabled successfully",
                    user: { id: user._id, email: user.email }
                });
            case 'disable':
                user.twoFactorEnabled = false;
                await user.save();
                return res.status(200).json({
                    success: true,
                    message: "Two-factor authentication has been disabled successfully"
                });
            case 'login':
                const accessToken = generateAccessToken(user);
                res.cookie('accessToken', accessToken, cookieConfig);
                return res.status(200).json({
                    success: true,
                    message: "OTP verification successful. Successfully logged in",
                    user: { id: user._id, email: user.email, accessToken }
                });
            default:
                return res.status(400).json({ message: "Invalid action." });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error." });
    }
};

const getCurrentUser = async (req, res) => {
    const userId = req.user.userId;

    try {
        const user = await User.findById(userId).populate('role').select('-password');

        res.json({
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role.name,
            profilePicture: user.profilePicture,
            googleId: user.googleId,
            facebookId: user.facebookId,
            twoFactorEnabled: user.twoFactorEnabled
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updateUserProfile = async (req, res) => {
    const { firstName, lastName, email, password, newPassword, role } = req.body;

    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if ((email || newPassword) && !await bcrypt.compare(password, user.password)) {
            return res.status(400).json({ message: 'Incorrect current password' });
        }

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (email) user.email = email;
        if (role) user.role = role;
        if (newPassword) { user.password = await bcrypt.hash(newPassword, 10); }

        await user.save();
        await user.populate('role');

        res.json({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role.name,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: `There is no registered user with the email ${email}` });

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
        await user.save();

        await sendResetPasswordEmail(user, resetToken);

        res.status(200).json({ success: true, message: `Password reset email sent to ${email}` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ message: 'Token is invalid or has expired' });

        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        await sendPasswordResetSuccessEmail(user);

        res.status(200).json({ success: true, message: 'Password has been reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const validateResetToken = async (req, res) => {
    const { token } = req.params;

    try {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) return res.status(400).json({ message: 'Token is invalid or has expired' });

        res.status(200).json({ success: true, message: 'Token is valid', email: user.email });
    } catch (error) {
        res.status(500).json({ message: 'Server error during token validation' });
    }
};

const logoutUser = (req, res) => {
    res.clearCookie('accessToken', {
        ...cookieConfig,
        maxAge: 0
    });

    res.clearCookie('connect.sid'), {
        ...cookieConfig,
        maxAge: 0
    };

    res.json({ message: 'Logout successful' });
};

module.exports = { registerUser, verifyOTP, resendOTP, loginUser, enable2FA, disable2FA, resend2FAOTP, verifyTwoFactorOTP, getCurrentUser, updateUserProfile, forgotPassword, resetPassword, validateResetToken, logoutUser };