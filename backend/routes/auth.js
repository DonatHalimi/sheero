const express = require('express');
const passport = require('passport');
const { registerUser, verifyOTP, resendOTP, loginUser, enable2FA, disable2FA, resend2FAOTP, verifyTwoFactorOTP,
    enableAuthenticator2FA, verifyAuthenticator2FA, handleSocialLogin, verifySocialLogin2FA, getExistingSecret,
    getCurrentUser, updateUserProfile, forgotPassword, resetPassword, validateResetToken, logoutUser,
    toggleLoginNotification,
} = require('../controllers/authController.js');
const { registerSchema, loginSchema } = require('../validations/auth');
const { requireAuth, conditionalRequireAuth } = require('../middleware/auth.js');
const validate = require('../middleware/validation');

const router = express.Router();

router.post('/register', validate(registerSchema), registerUser);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', validate(loginSchema), loginUser);
router.post('/enable-2fa', requireAuth, enable2FA);
router.post('/disable-2fa', requireAuth, disable2FA);
router.post('/resend-2fa', conditionalRequireAuth, resend2FAOTP);
router.post('/verify-2fa', verifyTwoFactorOTP);
router.post('/enable-2fa-auth', requireAuth, enableAuthenticator2FA);
router.post('/verify-2fa-auth', verifyAuthenticator2FA);
router.get('/get-existing-secret', requireAuth, getExistingSecret);
router.post('/verify-social-2fa', verifySocialLogin2FA);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/validate-token/:token', validateResetToken);
router.post('/notifications/toggle', requireAuth, toggleLoginNotification);
router.post('/logout', logoutUser);
router.get('/me', requireAuth, getCurrentUser);
router.put('/profile', requireAuth, updateUserProfile);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        req.query.provider = 'google';
        handleSocialLogin(req, res);
    }
);

// Facebook auth routes
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get(
    '/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    (req, res) => {
        req.query.provider = 'facebook';
        handleSocialLogin(req, res);
    }
);

module.exports = router;