const express = require('express');
const { getUsers, getUserById, createUser, updateUser, deleteUser, deleteUsers } = require('../controllers/userController');
const { createSchema, getByIdSchema, updateSchema, deleteSchema, deleteBulkSchema } = require('../validations/user');
const { requireAuthAndRole } = require('../middleware/auth');
const validate = require('../middleware/validation');

const router = express.Router();

router.post('/create', requireAuthAndRole('admin'), validate(createSchema), createUser);
router.get('/get', requireAuthAndRole('admin'), getUsers);
router.get('/get/:id', requireAuthAndRole('admin'), validate(getByIdSchema), getUserById);
router.put('/update/:id', requireAuthAndRole('admin'), validate(updateSchema), updateUser);
router.delete('/delete/:id', requireAuthAndRole('admin'), validate(deleteSchema), deleteUser);
router.delete('/delete-bulk', requireAuthAndRole('admin'), validate(deleteBulkSchema), deleteUsers);

module.exports = router;