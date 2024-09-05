const express = require('express');
const { getUsers, getUser, createUser, updateUser, deleteUser, deleteUsers } = require('../controllers/userController');
const router = express.Router();
const { protect, requireAuthAndRole } = require('../middleware/auth');

router.post('/create', requireAuthAndRole('admin'), createUser);
router.get('/get', getUsers);
router.get('/get/:id', requireAuthAndRole('admin'), getUser); // change authorizeRole if addition of profile is done later on
router.put('/update/:id', protect, updateUser);
router.delete('/delete/:id', requireAuthAndRole('admin'), deleteUser);
router.delete('/delete-bulk', requireAuthAndRole('admin'), deleteUsers);

module.exports = router;