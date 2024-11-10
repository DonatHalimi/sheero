const express = require('express');
const { registerUser, loginUser, getCurrentUser, updateUserProfile, logoutUser } = require('../controllers/authController.js');
const { requireAuth } = require('../middleware/auth.js');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', requireAuth, getCurrentUser);
router.put('/profile', requireAuth, updateUserProfile);

module.exports = router;