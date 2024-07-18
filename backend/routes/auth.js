const express = require('express');
const { registerUser, loginUser, token, getCurrentUser } = require('../controllers/authController.js');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/token', token);
router.post('/me', protect, getCurrentUser)

module.exports = router;
