const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
const cookieConfig = require('../config/auth/cookie');
const crypto = require('crypto');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const { JWT_SECRET, NODE_ENV } = require('../config/core/dotenv');
const { sendVerificationEmail, sendResetPasswordEmail, sendPasswordResetSuccessEmail, sendEnable2FAEmail, sendDisable2FAEmail, sendLogin2FAEmail } = require('../config/email/emailService');
const MemoryStore = require('../models/MemoryStore');

const redirectUrl = NODE_ENV === 'production'
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
    const { email, otp: userOtp, action } = req.body;

    if (!email || !userOtp) return res.status(400).json({ error: 'Email and OTP are required' });

    const storedOtp = verificationCodeStore.get(email) || twoFactorOtpStore.get(email);

    if (!storedOtp) return res.status(400).json({ error: "Invalid or expired OTP. Please request a new one" });
    if (storedOtp !== userOtp) return res.status(400).json({ error: 'Invalid OTP. Please try again' });

    try {
        if (action === 'disable' || action === 'enable') {
            const user = await User.findOne({ email }).populate('role');
            if (!user) return res.status(404).json({ error: 'User not found' });

            if (action === 'disable') {
                if (!user.twoFactorMethods.includes('email')) {
                    return res.status(400).json({ error: 'Email 2FA not enabled' });
                }

                user.twoFactorMethods = user.twoFactorMethods.filter(m => m !== 'email');
                if (user.twoFactorMethods.length === 0) {
                    user.twoFactorEnabled = false;
                }
            } else if (action === 'enable') {
                if (!user.twoFactorMethods.includes('email')) {
                    user.twoFactorMethods.push('email');
                }
                user.twoFactorEnabled = true;
            }

            await user.save();
            twoFactorOtpStore.delete(email);

            return res.status(200).json({
                success: true,
                message: `Email 2FA ${action}d successfully`
            });
        }

        const pendingUser = pendingUsersStore.get(email);
        if (pendingUser) {
            const newUser = new User(pendingUser);
            await newUser.save();

            pendingUsersStore.delete(email);
            verificationCodeStore.delete(email);

            const populatedUser = await User.findById(newUser._id).populate('role');
            const accessToken = generateAccessToken(populatedUser);
            res.cookie('accessToken', accessToken, cookieConfig);

            return res.status(200).json({
                success: true,
                message: "Email verified and logged in successfully",
                user: {
                    id: populatedUser._id,
                    firstName: populatedUser.firstName,
                    lastName: populatedUser.lastName,
                    email: populatedUser.email,
                    role: populatedUser.role.name,
                    accessToken: accessToken
                }
            });
        }

        const user = await User.findOne({ email }).populate('role');
        if (user) {
            twoFactorOtpStore.delete(email);

            const accessToken = generateAccessToken(user);
            res.cookie('accessToken', accessToken, cookieConfig);

            return res.status(200).json({
                success: true,
                message: "Login successful",
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role.name,
                    accessToken: accessToken
                }
            });
        }

        return res.status(400).json({ error: 'No pending registration or existing user found' });
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
            const usingEmail = user.twoFactorMethods.includes('email');

            if (usingEmail) {
                const newOtp = generateOTP();
                twoFactorOtpStore.set(email, newOtp.toString(), 10 * 60 * 1000);
                await sendLogin2FAEmail(email, newOtp);
            }

            return res.status(206).json({
                success: true,
                message: usingEmail
                    ? `OTP code sent to ${email} for two-factor authentication`
                    : 'Please use your authenticator app to complete login',
                email: email,
                requires2FA: true,
                twoFactorMethods: user.twoFactorMethods,
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
                accessToken: accessToken,
                twoFactorMethods: user.twoFactorMethods
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

    try {
        const result = await sendOTPForTwoFactor(user, 'enable');

        if (!user.twoFactorMethods.includes('email')) {
            user.twoFactorMethods.push('email');
        }
        user.twoFactorEnabled = true;
        await user.save();

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
                if (!user.twoFactorMethods.includes('email')) {
                    user.twoFactorMethods.push('email');
                }
                await user.save();
                return res.status(200).json({
                    success: true,
                    message: "Two-factor authentication has been enabled successfully",
                    user: { id: user._id, email: user.email }
                });
            case 'disable':
                user.twoFactorMethods = user.twoFactorMethods.filter(method => method !== 'email');
                if (user.twoFactorMethods.length === 0) {
                    user.twoFactorEnabled = false;
                }
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

const enableAuthenticator2FA = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.twoFactorMethods = user.twoFactorMethods.filter(m => m !== 'authenticator');
        user.twoFactorEnabled = user.twoFactorMethods.length > 0;

        const secret = speakeasy.generateSecret({
            name: `sheero:${user.email}`,
            issuer: 'sheero'
        });

        user.twoFactorSecret = secret.base32;
        await user.save();

        QRCode.toDataURL(secret.otpauth_url, (err, imageUrl) => {
            if (err) {
                console.error('QR Code generation error:', err);
                return res.status(500).json({ message: 'Error generating QR code' });
            }

            res.json({
                success: true,
                imageUrl,
                secret: secret.base32,
                email: user.email
            });
        });
    } catch (error) {
        console.error('Enable Authenticator Error:', error);
        res.status(500).json({ message: 'Server error during authenticator setup' });
    }
};

const verifyAuthenticator2FA = async (req, res) => {
    const { email, token, action, isAuthenticator } = req.body;

    try {
        const user = await User.findOne({ email }).select('+twoFactorSecret');
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isLogin = action === 'login' || !action;
        const isEnable = action === 'enable';
        const isDisable = action === 'disable';

        if (isLogin) {
            if (!user.twoFactorEnabled) return res.status(400).json({ message: '2FA not enabled' });

            const hasAuthenticator = user.twoFactorMethods.includes('authenticator');
            const isTokenValid = /^\d{6}$/.test(token);
            const isValid = isAuthenticator || (hasAuthenticator && isTokenValid);

            if (isValid) {
                if (!hasAuthenticator) return res.status(400).json({ message: 'Authenticator 2FA not enabled' });
                if (!user.twoFactorSecret) return res.status(400).json({ message: '2FA configuration missing' });

                const verified = speakeasy.totp.verify({
                    secret: user.twoFactorSecret,
                    encoding: 'base32',
                    token,
                    window: 2
                });

                if (!verified) return res.status(400).json({ message: 'Invalid authenticator code' });

                const accessToken = generateAccessToken(user);
                res.cookie('accessToken', accessToken, cookieConfig);

                return res.json({
                    success: true,
                    message: 'Login successful',
                    user: {
                        id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        role: user.role.name,
                        profilePicture: user.profilePicture,
                        twoFactorEnabled: user.twoFactorEnabled,
                        twoFactorMethods: user.twoFactorMethods
                    }
                });
            }
        }

        if (isEnable) {
            if (!user.twoFactorSecret) return res.status(400).json({ message: '2FA not set up' });

            const verified = speakeasy.totp.verify({
                secret: user.twoFactorSecret,
                encoding: 'base32',
                token,
                window: 2
            });

            if (!verified) return res.status(400).json({ message: 'Invalid authenticator code' });

            user.twoFactorEnabled = true;
            if (!user.twoFactorMethods.includes('authenticator')) {
                user.twoFactorMethods.push('authenticator');
            }
            await user.save();

            return res.json({
                success: true,
                message: 'Authenticator 2FA enabled successfully'
            });
        }

        if (isDisable) {
            const hasAuth2FA = user.twoFactorEnabled || user.twoFactorMethods.includes('authenticator');
            if (!isAuthenticator) return res.status(400).json({ message: 'Invalid method for this endpoint' });
            if (!hasAuth2FA) return res.status(400).json({ message: 'Authenticator 2FA not enabled' });

            const verified = speakeasy.totp.verify({
                secret: user.twoFactorSecret,
                encoding: 'base32',
                token,
                window: 2
            });

            if (!verified) return res.status(400).json({ message: 'Invalid authenticator code' });

            user.twoFactorMethods = user.twoFactorMethods.filter(m => m !== 'authenticator');
            if (user.twoFactorMethods.length === 0) {
                user.twoFactorEnabled = false;
            }
            user.twoFactorSecret = null;
            await user.save();

            return res.json({
                success: true,
                message: 'Authenticator 2FA disabled successfully'
            });
        }

        return res.status(400).json({ message: 'Invalid action specified' });
    } catch (error) {
        res.status(500).json({ message: 'Server error during 2FA verification' });
    }
};

const getExistingSecret = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        const has2FA = user || user.twoFactorSecret;
        if (!has2FA) return res.status(404).json({ message: 'No existing 2FA setup' });

        const otpauth = speakeasy.otpauthURL({
            secret: user.twoFactorSecret,
            label: `sheero:${user.email}`,
            issuer: 'sheero',
            encoding: 'base32'
        });

        QRCode.toDataURL(otpauth, (err, imageUrl) => {
            if (err) {
                console.error('Error generating QR code image:', err);
                throw err;
            }
            res.json({
                success: true,
                imageUrl,
                secret: user.twoFactorSecret
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving secret' });
    }
};

const handleSocialLogin = async (req, res) => {
    try {
        const user = req.user;

        if (user.twoFactorEnabled) {
            const usingEmail = user.twoFactorMethods.includes('email');

            if (usingEmail) {
                const newOtp = generateOTP();
                twoFactorOtpStore.set(user.email, newOtp.toString(), 10 * 60 * 1000);
                await sendLogin2FAEmail(user.email, newOtp);
            }

            const tempToken = jwt.sign(
                { userId: user._id, provider: req.query.provider, pending2FA: true },
                JWT_SECRET,
                { expiresIn: '10m' }
            );

            return res.redirect(
                `${redirectUrl}/verify-otp?email=${encodeURIComponent(user.email)}&action=login&social=true&temp=${tempToken}&methods=${encodeURIComponent(JSON.stringify(user.twoFactorMethods))}`
            );
        }

        const accessToken = generateAccessToken(user);
        res.cookie('accessToken', accessToken, cookieConfig);

        return res.redirect(`${redirectUrl}?auth_status=success&provider=${req.query.provider}`);
    } catch (error) {
        return res.redirect(`${redirectUrl}?auth_status=error&provider=${req.query.provider}&message=${encodeURIComponent(error.message)}`);
    }
};

const verifySocialLogin2FA = async (req, res) => {
    const { email, otp, tempToken, isAuthenticator } = req.body;

    if (!email || !tempToken) return res.status(400).json({ message: 'Email and temporary token are required' });

    try {
        const decoded = jwt.verify(tempToken, JWT_SECRET);
        const isPending2FA = decoded || decoded.pending2FA;
        if (!isPending2FA) return res.status(400).json({ message: 'Invalid or expired temporary token' });

        const user = await User.findById(decoded.userId).populate('role').select('+twoFactorSecret');
        if (!user) return res.status(404).json({ message: 'User not found' });

        const hasAuthenticator = user.twoFactorMethods.includes('authenticator');
        const hasEmail = user.twoFactorMethods.includes('email');
        const isNumericCode = /^\d{6}$/.test(otp);
        const shouldUseAuthenticator = (isAuthenticator || (hasAuthenticator && isNumericCode));

        if (shouldUseAuthenticator) {
            if (!hasAuthenticator) return res.status(400).json({ message: 'Authenticator 2FA not enabled for this user' });

            if (!user.twoFactorSecret) return res.status(400).json({ message: '2FA configuration missing' });

            const verified = speakeasy.totp.verify({
                secret: user.twoFactorSecret,
                encoding: 'base32',
                token: otp,
                window: 2
            });

            if (!verified) return res.status(400).json({ message: 'Invalid authenticator code' });

        } else if (hasEmail) {
            const storedOtp = twoFactorOtpStore.get(email);
            const invalidOtp = storedOtp.toString() !== otp.toString();

            if (!storedOtp) return res.status(400).json({ message: 'No OTP request found. Please try again' });
            if (invalidOtp) return res.status(400).json({ message: 'Invalid OTP' });

            twoFactorOtpStore.delete(email);
        } else {
            return res.status(400).json({ message: 'No valid 2FA method found' });
        }

        const accessToken = generateAccessToken(user);
        res.cookie('accessToken', accessToken, cookieConfig);

        return res.status(200).json({
            success: true,
            message: "Social login with 2FA successful",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role.name,
                accessToken
            }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
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
            twoFactorEnabled: user.twoFactorEnabled,
            twoFactorMethods: user.twoFactorMethods
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

module.exports = {
    registerUser, verifyOTP, resendOTP, loginUser, enable2FA, disable2FA, resend2FAOTP, verifyTwoFactorOTP,
    enableAuthenticator2FA, verifyAuthenticator2FA, getExistingSecret, handleSocialLogin, verifySocialLogin2FA,
    getCurrentUser, updateUserProfile, forgotPassword, resetPassword, validateResetToken, logoutUser
};