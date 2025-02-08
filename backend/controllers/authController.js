const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
const cookieConfig = require('../config/cookie');
const crypto = require('crypto');
const { JWT_SECRET } = require('../config/dotenv');
const { sendVerificationEmail, sendResetPasswordEmail, sendPasswordResetSuccessEmail, send2FAEmail, sendDisable2FAEmail, sendLogin2FAEmail } = require('../config/emailService');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const generateAccessToken = (user) => {
    return jwt.sign({
        userId: user._id,
        role: user.role
    }, JWT_SECRET, { expiresIn: '7d' });
};

const otpStore = {};
const pendingUsers = {};
const rateLimitStore = {};
const twoFactorOtpStore = {};

const registerUser = async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const validRole = await Role.findById(role) || await Role.findOne({ name: 'user' });

        pendingUsers[email] = {
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: validRole._id,
            createdAt: Date.now()
        };

        const otp = generateOTP();

        otpStore[email] = {
            otp,
            expires: Date.now() + 5 * 60 * 1000
        };

        await sendVerificationEmail(email, otp);

        res.status(201).json({ message: `OTP code sent to ${email}. Please check your inbox`, email });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const verifyOTP = async (req, res) => {
    const { email, otp: userOtp } = req.body;

    if (!email || !userOtp) return res.status(400).json({ error: 'Email and OTP are required.' });

    const record = otpStore[email];

    if (!record) return res.status(400).json({ error: 'Invalid or expired OTP. Please request a new one.' });

    if (record.expires < Date.now()) return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });

    if (record.otp !== userOtp) return res.status(400).json({ error: 'Invalid OTP. Please try again.' });

    delete otpStore[email];

    const pendingUser = pendingUsers[email];
    if (!pendingUser) return res.status(400).json({ error: 'No pending registration found for this email.' });

    try {
        const user = new User(pendingUser);
        await user.save();
        delete pendingUsers[email];

        res.status(200).json({ success: true, message: `Email verified and account created successfully for ${email}. Click to copy email.` });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create user account', error: error.message });
    }
};

const resendOTP = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required.' });

    try {
        const currentTime = Date.now();
        const rateLimitDuration = 60 * 1000;
        const lastRequestTime = rateLimitStore[email];

        if (lastRequestTime && currentTime - lastRequestTime < rateLimitDuration) {
            const waitTime = Math.ceil((rateLimitDuration - (currentTime - lastRequestTime)) / 1000);
            return res.status(429).json({ error: `Too many requests. Please wait ${waitTime} seconds before trying again.` });
        }

        const record = otpStore[email];
        if (!record) return res.status(400).json({ error: 'No OTP found for this email. Please register first.' });

        const newOtp = generateOTP();
        otpStore[email] = {
            otp: newOtp,
            expires: Date.now() + 10 * 60 * 1000
        };

        rateLimitStore[email] = currentTime;
        await sendVerificationEmail(email, newOtp);

        res.status(200).json({ message: 'OTP re-sent to email. Please check your inbox' });
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
            const expiresIn = Date.now() + 10 * 60 * 1000;

            twoFactorOtpStore[email] = {
                otp: newOtp.toString(),
                expires: expiresIn
            };

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

const enable2FA = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized. User not found.' });
    }

    const userId = req.user.userId;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        if (user.twoFactorEnabled) {
            return res.status(400).json({ message: 'Two-factor authentication is already enabled.' });
        }

        const newOtp = generateOTP();
        const expiresIn = Date.now() + 10 * 60 * 1000;

        twoFactorOtpStore[user.email] = {
            otp: newOtp.toString(),
            expires: expiresIn
        };

        await send2FAEmail(user.email, newOtp);

        res.status(200).json({
            success: true,
            message: `OTP code sent to ${user.email}. Please verify to enable two-factor authentication`,
            email: user.email
        });
    } catch (error) {
        console.error('Error enabling 2FA:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

const disable2FA = async (req, res) => {
    const userId = req.user.userId;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found." });

        if (!user.twoFactorEnabled) return res.status(400).json({ message: "Two-factor authentication is already disabled." });

        const newOtp = generateOTP();

        twoFactorOtpStore[user.email] = {
            otp: newOtp,
            expires: Date.now() + 10 * 60 * 1000
        };

        try {
            await sendDisable2FAEmail(user.email, newOtp);

            res.status(200).json({
                success: true,
                message: `OTP code sent to ${user.email}. Please verify to disable two-factor authentication`,
                email: user.email,
                disableOtpPending: true
            });
        } catch (emailError) {
            res.status(500).json({ success: false, message: "Failed to send OTP email" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const verifyLoginOTP = async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
    }

    const record = twoFactorOtpStore[email];

    if (!record) {
        return res.status(400).json({ message: "No OTP request found. Please try again" });
    }

    if (record.expires < Date.now()) {
        delete twoFactorOtpStore[email];
        return res.status(400).json({ message: "OTP has expired. Please try again" });
    }

    if (record.otp.toString() !== otp.toString()) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    delete twoFactorOtpStore[email];

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const accessToken = generateAccessToken(user);
        res.cookie('accessToken', accessToken, cookieConfig);

        res.status(200).json({
            success: true,
            message: "OTP verification successful. Successfully logged in",
            user: {
                id: user._id,
                email: user.email,
                accessToken
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
};

const verifyEnable2FAOTP = async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required." });
    }

    const record = twoFactorOtpStore[email];

    if (!record) {
        return res.status(400).json({ message: "No OTP request found. Please try again." });
    }

    if (record.expires < Date.now()) {
        delete twoFactorOtpStore[email];
        return res.status(400).json({ message: "OTP has expired. Please try again." });
    }

    if (record.otp.toString() !== otp.toString()) {
        return res.status(400).json({ message: "Invalid OTP." });
    }

    delete twoFactorOtpStore[email];

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        user.twoFactorEnabled = true;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Two-factor authentication has been enabled successfully.",
            user: {
                id: user._id,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
};

const verifyDisable2FAOTP = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
    }

    const record = twoFactorOtpStore[email];
    if (!record) {
        return res.status(400).json({ message: "No OTP request found. Please try again" });
    }

    if (record.expires < Date.now()) {
        delete twoFactorOtpStore[email];
        return res.status(400).json({ message: "OTP has expired. Please try again" });
    }

    if (record.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP." });
    }

    delete twoFactorOtpStore[email];

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        user.twoFactorEnabled = false;
        await user.save();

        res.status(200).json({ success: true, message: "Two-factor authentication disabled successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
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
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;;
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

module.exports = { registerUser, verifyOTP, resendOTP, loginUser, enable2FA, verifyEnable2FAOTP, verifyLoginOTP, disable2FA, verifyDisable2FAOTP, getCurrentUser, updateUserProfile, forgotPassword, resetPassword, validateResetToken, logoutUser };