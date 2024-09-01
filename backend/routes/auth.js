const express = require('express');
const { registerUser, loginUser, getCurrentUser, updateUserProfile, refreshAccessToken, logoutUser } = require('../controllers/authController.js');
const { authenticateToken } = require('../middleware/auth.js');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshAccessToken);
router.post('/logout', logoutUser);
router.get('/me', authenticateToken, getCurrentUser);
router.put('/profile', authenticateToken, updateUserProfile);

module.exports = router;