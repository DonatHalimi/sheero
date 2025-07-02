const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
const { accessCookieConfig, refreshCookieConfig } = require('../config/auth/cookie');
const crypto = require('crypto');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const { JWT_SECRET } = require('../config/core/dotenv');
const {
    sendVerificationEmail, sendResetPasswordEmail, sendPasswordResetSuccessEmail, sendEnable2FAEmail,
    sendDisable2FAEmail, sendLogin2FAEmail, sendLoginNotificationEmail
} = require('../config/email/service');
const { getLocationFromIP, getClientIp, getClientUserAgent } = require('../config/auth/loginNotifications');
const { frontendUrl, generateOTP, generateAccessToken, verificationCodeStore, pendingUsersStore, rateLimitStore, twoFactorRateLimitStore, twoFactorOtpStore, generateRefreshToken } = require('../config/core/utils');
const { addToRevokedTokens } = require('../middleware/auth');

const handleSuccessfulLogin = async (user, req, res, method = 'password', provider = null) => {
    const ipAddress = getClientIp(req);
    const userAgent = getClientUserAgent(req);
    const locationInfo = getLocationFromIP(ipAddress);
    const deviceKey = `${userAgent.substring(0, 50)}:${ipAddress}`;
    const isNewDevice = !user.deviceHistory.has(deviceKey);

    const loginData = {
        ipAddress,
        userAgent,
        status: 'success',
        method,
        provider,
        isNewDevice,
        location: locationInfo
    };

    await user.addLoginAttempt(loginData);

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie('accessToken', accessToken, accessCookieConfig);
    res.cookie('refreshToken', refreshToken, refreshCookieConfig);

    if (user.loginNotifications) {
        await sendLoginNotificationEmail(user, {
            ...loginData,
            timestamp: new Date()
        });
    }

    return {
        success: true,
        user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role.name,
            accessToken,
        }
    };
};

const handleTwoFactorInit = (user, action) => {
    const otp = generateOTP();
    twoFactorOtpStore.set(user.email, otp.toString(), 10 * 60 * 1000);

    const actionMessages = {
        enable: `OTP code sent to ${user.email}. Please verify to enable two-factor authentication`,
        disable: `OTP code sent to ${user.email}. Please verify to disable two-factor authentication`,
        login: `OTP code sent to ${user.email}. Please verify your login using the OTP code`
    };

    const emailActions = {
        enable: sendEnable2FAEmail,
        disable: sendDisable2FAEmail,
        login: sendLogin2FAEmail
    };

    return {
        sendEmail: () => emailActions[action](user.email, otp),
        message: actionMessages[action]
    };
};

const verifyTwoFactorCode = async (email, otp) => {
    const storedOtp = twoFactorOtpStore.get(email);
    if (!storedOtp) return { valid: false, message: "No OTP request found. Please try again" };
    if (storedOtp.toString() !== otp.toString()) return { valid: false, message: "Invalid OTP" };
    twoFactorOtpStore.delete(email);
    return { valid: true };
};

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
            hasSetProfilePassword: true,
            createdAt: Date.now()
        });

        const otp = generateOTP();
        verificationCodeStore.set(email, otp, 5 * 60 * 1000);

        await sendVerificationEmail(email, otp);

        res.status(201).json({ success: true, message: `OTP code sent to ${email}. Please check your inbox`, email });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error registering user', error: error.message });
    }
};

const verifyOTP = async (req, res) => {
    const { email, otp: userOtp, action } = req.body;

    if (!email || !userOtp) return res.status(400).json({ success: false, message: 'Email and OTP are required' });

    const storedOtp = verificationCodeStore.get(email) || twoFactorOtpStore.get(email);
    if (!storedOtp) return res.status(400).json({ success: false, message: "Invalid or expired OTP. Please request a new one" });
    if (storedOtp !== userOtp) return res.status(400).json({ success: false, message: 'Invalid OTP. Please try again' });

    try {
        if (action === 'disable' || action === 'enable') {
            const user = await User.findOne({ email }).populate('role');
            if (!user) return res.status(404).json({ success: false, message: 'User not found' });

            if (action === 'disable') {
                if (!user.twoFactorMethods.includes('email')) return res.status(400).json({ success: false, message: 'Email 2FA not enabled' });

                user.twoFactorMethods = user.twoFactorMethods.filter(m => m !== 'email');
                user.twoFactorEnabled = user.twoFactorMethods.length > 0;
            } else {
                if (!user.twoFactorMethods.includes('email')) user.twoFactorMethods.push('email');

                user.twoFactorEnabled = true;
            }

            await user.save();
            twoFactorOtpStore.delete(email);
            return res.status(200).json({ success: true, message: `Email 2FA ${action}d successfully` });
        }

        const pendingUser = pendingUsersStore.get(email);
        if (pendingUser) {
            const newUser = new User(pendingUser);
            await newUser.save();

            pendingUsersStore.delete(email);
            verificationCodeStore.delete(email);

            const populatedUser = await User.findById(newUser._id).populate('role');
            const result = await handleSuccessfulLogin(populatedUser, req, res);

            return res.status(200).json({
                success: true,
                message: "Email verified and logged in successfully",
                user: { ...result.user, role: populatedUser.role.name }
            });
        }

        const user = await User.findOne({ email }).populate('role');
        if (user) {
            twoFactorOtpStore.delete(email);
            const result = await handleSuccessfulLogin(user, req, res, 'otp', 'email');
            return res.status(200).json({
                success: true,
                message: "Login successful",
                user: { ...result.user }
            });
        }

        return res.status(400).json({ error: 'No pending registration or existing user found' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error verifying OTP', error: error.message });
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
            return res.status(429).json({ success: false, message: `Too many requests. Please wait ${waitTime} seconds before trying again` });
        }

        const existingOtp = verificationCodeStore.get(email);
        if (!existingOtp) return res.status(400).json({ success: false, message: 'No OTP found for this email. Please register first' });

        const newOtp = generateOTP();
        verificationCodeStore.set(email, newOtp, 10 * 60 * 1000);
        rateLimitStore.set(email, currentTime);

        await sendVerificationEmail(email, newOtp);
        res.status(200).json({ success: true, message: `OTP re-sent to ${email}. Please check your inbox` });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error re-sending OTP', error: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const ipAddress = getClientIp(req);
    const userAgent = getClientUserAgent(req);

    try {
        const user = await User.findOne({ email }).populate('role');
        if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            await user.addLoginAttempt({
                ipAddress,
                userAgent,
                status: 'failed',
                method: 'password',
                ...getLocationFromIP(ipAddress)
            });
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        if (user.twoFactorEnabled) {
            const usingEmail = user.twoFactorMethods.includes('email');
            if (usingEmail) {
                const { sendEmail, message } = handleTwoFactorInit(user, 'login');
                await sendEmail();
                return res.status(206).json({
                    success: true,
                    message,
                    email,
                    requires2FA: true,
                    twoFactorMethods: user.twoFactorMethods,
                });
            }
            return res.status(206).json({
                success: true,
                message: 'Please use your authenticator app to complete login',
                email,
                requires2FA: true,
                twoFactorMethods: user.twoFactorMethods,
            });
        }

        const result = await handleSuccessfulLogin(user, req, res);
        res.status(200).json({ ...result, message: "Successfully logged in" });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error logging in', error: error.message });
    }
};

const enable2FA = async (req, res) => {
    try {
        const { method } = req.body;
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (method === 'authenticator') {
            return res.status(200).json({
                success: true,
                message: 'Please set up your authenticator app and verify to enable 2FA',
                email: user.email,
                requiresAuthenticatorSetup: true
            });
        }

        const { sendEmail, message } = handleTwoFactorInit(user, 'enable');
        await sendEmail();

        if (!user.twoFactorMethods.includes('email')) {
            user.twoFactorMethods.push('email');
        }
        user.twoFactorEnabled = true;
        await user.save();

        res.status(200).json({ success: true, message, email: user.email });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error enabling two-factor authentication', error: error.message });
    }
};

const disable2FA = async (req, res) => {
    try {
        const { method } = req.body;
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (!user.twoFactorEnabled) return res.status(400).json({ success: false, message: 'Two-factor authentication is already disabled' });

        if (method === 'authenticator') {
            if (!user.twoFactorMethods.includes('authenticator')) {
                return res.status(400).json({ success: false, message: 'Authenticator 2FA is not enabled' });
            }

            return res.status(200).json({
                success: true,
                message: 'Please enter your authenticator code to disable 2FA',
                email: user.email,
                requiresAuthenticatorVerification: true
            });
        }

        const { sendEmail, message } = handleTwoFactorInit(user, 'disable');
        await sendEmail();

        res.status(200).json({ success: true, message, email: user.email, disableOtpPending: true });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error disabling two-factor authentication', error: error.message });
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
            return res.status(429).json({ success: false, message: `Too many requests. Please wait ${waitTime} seconds before trying again` });
        }

        if (action === 'login') {
            user = await User.findOne({ email });
            if (!user) return res.status(404).json({ success: false, message: 'User not found' });
            if (!user.twoFactorEnabled) return res.status(400).json({ success: false, message: 'Two-factor authentication is not enabled for this account' });
        } else {
            if (!user) {
                user = await User.findById(req.user.userId);
                if (!user) return res.status(404).json({ success: false, message: 'User not found' });
            }
            if (action === 'disable' && !user.twoFactorEnabled) return res.status(400).json({ success: false, message: 'Two-factor authentication is already disabled' });
        }

        const { sendEmail, message } = handleTwoFactorInit(user, action);
        await sendEmail();
        twoFactorRateLimitStore.set(email, currentTime);

        res.status(200).json({ success: true, message, email: user.email, action });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error resending two-factor authentication OTP', error: error.message });
    }
};

const verifyTwoFactorOTP = async (req, res) => {
    const { email, otp, action } = req.body;

    if (!email || !otp || !action) return res.status(400).json({ success: false, message: 'Email, OTP and action are required' });

    try {
        const { valid, message } = await verifyTwoFactorCode(email, otp);
        if (!valid) return res.status(400).json({ success: false, message });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

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
                user.twoFactorEnabled = user.twoFactorMethods.length > 0;
                await user.save();
                return res.status(200).json({
                    success: true,
                    message: "Two-factor authentication has been disabled successfully"
                });
            case 'login':
                const result = await handleSuccessfulLogin(user, req, res, 'otp');
                return res.status(200).json({ ...result, message: "OTP verification successful. Successfully logged in" });
            default:
                return res.status(400).json({ success: false, message: "Invalid action type" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error verifying OTP", error: error.message });
    }
};

const enableAuthenticator2FA = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        user.twoFactorMethods = user.twoFactorMethods.filter(m => m !== 'authenticator');
        user.twoFactorEnabled = user.twoFactorMethods.length > 0;

        const secret = speakeasy.generateSecret({
            name: `sheero:${user.email}`,
            issuer: 'sheero'
        });

        user.twoFactorSecret = secret.base32;
        await user.save();

        QRCode.toDataURL(secret.otpauth_url, (err, imageUrl) => {
            if (err) return res.status(500).json({ success: false, message: 'Error generating QR code' });
            res.json({ success: true, imageUrl, secret: secret.base32, email: user.email });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error enabling Authenticator 2FA', error: error.message });
    }
};

const verifyAuthenticator2FA = async (req, res) => {
    const { email, token, action, isAuthenticator } = req.body;

    try {
        const user = await User.findOne({ email }).select('+twoFactorSecret');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const isLogin = action === 'login' || !action;
        const isEnable = action === 'enable';
        const isDisable = action === 'disable';

        if (isLogin) {
            if (!user.twoFactorEnabled) return res.status(400).json({ success: false, message: '2FA not enabled' });
            if (!user.twoFactorMethods.includes('authenticator')) return res.status(400).json({ success: false, message: 'Authenticator 2FA not enabled' });
            if (!user.twoFactorSecret) return res.status(400).json({ success: false, message: '2FA configuration missing' });

            const verified = speakeasy.totp.verify({
                secret: user.twoFactorSecret,
                encoding: 'base32',
                token,
                window: 2
            });

            if (!verified) return res.status(400).json({ success: false, message: 'Invalid authenticator code' });

            const result = await handleSuccessfulLogin(user, req, res, 'authenticator');
            return res.json({ ...result, message: 'Login successful' });
        }

        if (isEnable) {
            if (!user.twoFactorSecret) return res.status(400).json({ success: false, message: '2FA not set up' });

            const verified = speakeasy.totp.verify({
                secret: user.twoFactorSecret,
                encoding: 'base32',
                token,
                window: 2
            });

            if (!verified) return res.status(400).json({ success: false, message: 'Invalid authenticator code' });

            user.twoFactorEnabled = true;
            if (!user.twoFactorMethods.includes('authenticator')) {
                user.twoFactorMethods.push('authenticator');
            }
            await user.save();

            return res.json({ success: true, message: 'Authenticator 2FA enabled successfully' });
        }

        if (isDisable) {
            const hasAuth2FA = user.twoFactorEnabled || user.twoFactorMethods.includes('authenticator');
            if (!isAuthenticator) return res.status(400).json({ success: false, message: 'Invalid method for this endpoint' });
            if (!hasAuth2FA) return res.status(400).json({ success: false, message: 'Authenticator 2FA not enabled' });

            const verified = speakeasy.totp.verify({
                secret: user.twoFactorSecret,
                encoding: 'base32',
                token,
                window: 2
            });

            if (!verified) return res.status(400).json({ success: false, message: 'Invalid authenticator code' });

            user.twoFactorMethods = user.twoFactorMethods.filter(m => m !== 'authenticator');
            user.twoFactorEnabled = user.twoFactorMethods.length > 0;
            user.twoFactorSecret = null;
            await user.save();

            return res.json({ success: true, message: 'Authenticator 2FA disabled successfully' });
        }

        return res.status(400).json({ success: false, message: 'Invalid action type' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error verifying Authenticator 2FA', error: error.message });
    }
};

const getExistingSecret = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user || !user.twoFactorSecret) return res.status(404).json({ success: false, message: 'No existing 2FA setup' });

        const otpauth = speakeasy.otpauthURL({
            secret: user.twoFactorSecret,
            label: `sheero:${user.email}`,
            issuer: 'sheero',
            encoding: 'base32'
        });

        QRCode.toDataURL(otpauth, (err, imageUrl) => {
            if (err) return res.status(500).json({ success: false, message: 'Error getting secret' });
            res.json({ success: true, imageUrl, secret: user.twoFactorSecret });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error retrieving secret', error: error.message });
    }
};

const handleSocialLogin = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('role');
        const provider = req.query.provider;

        if (!user) return res.redirect(`${frontendUrl}?auth_status=error&provider=${provider}&message=${encodeURIComponent('User not found')}`);

        if (user.twoFactorEnabled) {
            const usingEmail = user.twoFactorMethods.includes('email');
            if (usingEmail) {
                const { sendEmail } = handleTwoFactorInit(user, 'login');
                await sendEmail();
            }

            const tempToken = jwt.sign(
                { userId: user._id, provider, pending2FA: true },
                JWT_SECRET,
                { expiresIn: '10m' }
            );

            return res.redirect(
                `${frontendUrl}/verify-otp?email=${encodeURIComponent(user.email)}&action=login&social=true&temp=${tempToken}&methods=${encodeURIComponent(JSON.stringify(user.twoFactorMethods))}`
            );
        }

        await handleSuccessfulLogin(user, req, res, provider, provider);

        return res.redirect(`${frontendUrl}?auth_status=success&provider=${provider}`);
    } catch (error) {
        return res.redirect(`${frontendUrl}?auth_status=error&provider=${req.query.provider}&message=${encodeURIComponent(error.message)}`);
    }
};

const verifySocialLogin2FA = async (req, res) => {
    const { email, otp, tempToken, isAuthenticator } = req.body;

    if (!email || !tempToken) return res.status(400).json({ success: false, message: 'Email and temporary token are required' });

    try {
        const decoded = jwt.verify(tempToken, JWT_SECRET);
        if (!decoded.pending2FA) return res.status(400).json({ success: false, message: 'Invalid or expired temporary token' });

        const user = await User.findById(decoded.userId).populate('role').select('+twoFactorSecret');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const hasAuthenticator = user.twoFactorMethods.includes('authenticator');
        const hasEmail = user.twoFactorMethods.includes('email');
        const isNumericCode = /^\d{6}$/.test(otp);
        const shouldUseAuthenticator = (isAuthenticator || (hasAuthenticator && isNumericCode));

        if (shouldUseAuthenticator) {
            if (!hasAuthenticator) return res.status(400).json({ success: false, message: 'Authenticator 2FA not enabled for this user' });

            if (!user.twoFactorSecret) return res.status(400).json({ success: false, message: '2FA configuration missing' });

            const verified = speakeasy.totp.verify({
                secret: user.twoFactorSecret,
                encoding: 'base32',
                token: otp,
                window: 2
            });

            if (!verified) return res.status(400).json({ success: false, message: 'Invalid authenticator code' });
        } else if (hasEmail) {
            const { valid, message } = await verifyTwoFactorCode(email, otp);
            if (!valid) return res.status(400).json({ success: false, message });
        } else {
            return res.status(400).json({ success: false, message: 'No valid 2FA method found' });
        }

        const result = await handleSuccessfulLogin(user, req, res, 'social-2fa', decoded.provider);

        return res.status(200).json({
            success: true,
            message: "Social login with 2FA successful",
            user: result.user
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error verifying social login 2FA', error: error.message });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).populate('role').select('-password');
        res.json({
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            hasSetProfilePassword: user.hasSetProfilePassword,
            role: user.role.name,
            profilePicture: user.profilePicture,
            googleId: user.googleId,
            facebookId: user.facebookId,
            twoFactorEnabled: user.twoFactorEnabled,
            twoFactorMethods: user.twoFactorMethods,
            loginNotifications: user.loginNotifications
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error getting current user', error: error.message });
    }
};

const updateUserProfile = async (req, res) => {
    const { firstName, lastName, email, password, newPassword, role } = req.body;

    try {
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const isOAuthUser = Boolean(user.googleId || user.facebookId);

        const canSetPassword = isOAuthUser && !user.hasSetProfilePassword;

        if (email || newPassword) {
            if (canSetPassword) {
                if (!newPassword) {
                    return res.status(400).json({ success: false, message: 'New password is required' });
                }
            } else {
                if (!password) return res.status(400).json({ success: false, message: 'Current password is required' });

                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) return res.status(400).json({ success: false, message: 'Incorrect current password' });
            }
        }

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (email) user.email = email;
        if (role) user.role = role;
        if (newPassword) {
            user.password = await bcrypt.hash(newPassword, 10);
            if (isOAuthUser) user.hasSetProfilePassword = true;
        }

        await user.save();
        await user.populate('role');

        const successMessage = canSetPassword && newPassword ? 'Password set successfully' : 'Profile updated successfully';

        res.json({
            success: true,
            message: successMessage,
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role.name,
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating user profile', error: error.message });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: `There is no registered user with the email ${email}` });

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
        await user.save();

        await sendResetPasswordEmail(user, resetToken);
        res.status(200).json({ success: true, message: `Password reset email sent to ${email}` });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error sending password reset email', error: error.message });
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

        if (!user) return res.status(400).json({ success: false, message: 'Token is invalid or has expired' });

        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        await sendPasswordResetSuccessEmail(user);
        res.status(200).json({ success: true, message: 'Password has been reset successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error resetting password', error: error.message });
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

        if (!user) return res.status(400).json({ success: false, message: 'Token is invalid or has expired' });
        res.status(200).json({ success: true, message: 'Token is valid', email: user.email });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error validating reset token', error: error.message });
    }
};

const toggleLoginNotification = async (req, res) => {
    const { loginNotifications } = req.body;

    try {
        const user = await User.findById(req.user.userId);
        user.loginNotifications = loginNotifications;

        await user.save();
        res.status(200).json({ success: true, message: `Login notifications ${user.loginNotifications ? 'enabled' : 'disabled'} successfully`, loginNotifications });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error toggling login notifications', error: error.message });
    }
};

const logoutUser = (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
        addToRevokedTokens(refreshToken);
    }

    res.clearCookie('accessToken', { ...accessCookieConfig, maxAge: 0 });
    res.clearCookie('refreshToken', { ...refreshCookieConfig, maxAge: 0 });
    res.clearCookie('connect.sid', { ...accessCookieConfig, maxAge: 0 });

    res.json({ success: true, message: 'Logout successful' });
};

module.exports = {
    registerUser, verifyOTP, resendOTP, loginUser, enable2FA, disable2FA, resend2FAOTP, verifyTwoFactorOTP,
    enableAuthenticator2FA, verifyAuthenticator2FA, getExistingSecret, handleSocialLogin, verifySocialLogin2FA,
    getCurrentUser, updateUserProfile, forgotPassword, resetPassword, validateResetToken, toggleLoginNotification, logoutUser
};