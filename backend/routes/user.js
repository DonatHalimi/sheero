const express = require('express');
const { getUsers, getUser, createUser, updateUser, deleteUser } = require('../controllers/userController');
const router = express.Router();
const { protect, authorizeRole } = require('../middleware/auth');

router.post('/create', protect, authorizeRole('admin'), createUser);
router.get('/get', protect, authorizeRole('admin'), getUsers);
router.get('/get/:id', protect, authorizeRole('admin'), getUser); // change authorizeRole if addition of profile is done later on
router.put('/update/:id', protect, updateUser);
router.delete('/delete/:id', protect, authorizeRole('admin'), deleteUser);

module.exports = router;