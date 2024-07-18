const express = require('express');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

router.get('/user', authenticateToken, (req, res) => {
    res.json({ message: 'User content' });
});

router.get('/admin', authenticateToken, authorizeRole('admin'), (req, res) => {
    res.json({ message: 'Admin content' });
});

module.exports = router;