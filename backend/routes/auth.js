const express = require('express');
const cookieConfig = require('../config/cookie');
const passport = require('passport');
const { registerUser, verifyOTP, resendOTP, loginUser, enable2FA, disable2FA, resend2FAOTP, verifyTwoFactorOTP, getCurrentUser, updateUserProfile, forgotPassword, resetPassword, validateResetToken, logoutUser } = require('../controllers/authController.js');
const { registerSchema, loginSchema } = require('../validations/auth');
const { requireAuth, conditionalRequireAuth } = require('../middleware/auth.js');
const validate = require('../middleware/validation');
const { NODE_ENV } = require('../config/dotenv.js');

const router = express.Router();

const redirectUrl = NODE_ENV === 'production'
    ? 'https://sheero.onrender.com'
    : 'http://localhost:3000';

router.post('/register', validate(registerSchema), registerUser);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', validate(loginSchema), loginUser);
router.post('/enable-2fa', requireAuth, enable2FA);
router.post('/disable-2fa', requireAuth, disable2FA);
router.post('/resend-2fa', conditionalRequireAuth, resend2FAOTP);
router.post('/verify-2fa', verifyTwoFactorOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/validate-token/:token', validateResetToken);
router.post('/logout', logoutUser);
router.get('/me', requireAuth, getCurrentUser);
router.put('/profile', requireAuth, updateUserProfile);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        try {
            const accessToken = req.user.generateAccessToken();
            res.cookie('accessToken', accessToken, cookieConfig);

            const redirectScript = `
                if (window.opener) {
                    window.opener.postMessage(
                        { type: 'GOOGLE_AUTH_SUCCESS' },
                        '${redirectUrl}'
                    );
                    window.close();
                } else {
                    window.location.href = '${redirectUrl}';
                }
            `;

            res.send(`
                <script>
                    ${redirectScript}
                </script>
            `);
        } catch (error) {
            res.status(500).send(`
                <script>
                    alert('Authentication Failed. Please try again.');
                    window.close();
                </script>
            `);
        }
    }
);

// Facebook auth routes
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get(
    '/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    (req, res) => {
        try {
            const accessToken = req.user.generateAccessToken();
            res.cookie('accessToken', accessToken, cookieConfig);

            const redirectScript = `
                if (window.opener) {
                    window.opener.postMessage(
                        { type: 'FACEBOOK_AUTH_SUCCESS' },
                        '${redirectUrl}'
                    );
                    window.close();
                } else {
                    window.location.href = '${redirectUrl}';
                }
            `;

            res.send(`
                <script>
                    ${redirectScript}
                </script>
            `);
        } catch (error) {
            res.status(500).send(`
                <script>
                    alert('Authentication Failed. Please try again.');
                    window.close();
                </script>
            `);
        }
    }
);

module.exports = router;