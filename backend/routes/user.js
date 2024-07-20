const express = require('express');
const { getUsers, getUser, createUser, updateUser, deleteUser } = require('../controllers/userController');
const router = express.Router();
const { protect, requireAuthAndRole } = require('../middleware/auth');

router.post('/create', requireAuthAndRole('admin'), createUser);
router.get('/get', requireAuthAndRole('admin'), getUsers);
router.get('/get/:id', requireAuthAndRole('admin'), getUser); // change authorizeRole if addition of profile is done later on
router.put('/update/:id', protect, updateUser);
router.delete('/delete/:id', requireAuthAndRole('admin'), deleteUser);

module.exports = router;