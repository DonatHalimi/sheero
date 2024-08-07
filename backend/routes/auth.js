const express = require('express');
const { registerUser, loginUser, getCurrentUser, updateUserProfile } = require('../controllers/authController.js');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/me', protect, getCurrentUser);
router.put('/profile', protect, updateUserProfile);

module.exports = router;
