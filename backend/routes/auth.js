const express = require('express');
const { registerUser, loginUser, getCurrentUser, updateUserProfile, logoutUser } = require('../controllers/authController.js');
const { registerSchema, loginSchema } = require('../validations/auth');
const { requireAuth } = require('../middleware/auth.js');
const validate = require('../middleware/validation');

const router = express.Router();

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.post('/logout', logoutUser);
router.get('/me', requireAuth, getCurrentUser);
router.put('/profile', requireAuth, updateUserProfile);

module.exports = router;