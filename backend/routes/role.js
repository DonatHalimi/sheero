const express = require('express');
const { createRole, getRoles, getRoleById, updateRole, deleteRole, deleteRoles } = require('../controllers/roleController');
const { requireAuthAndRole } = require('../middleware/auth');

const router = express.Router();

router.post('/create', requireAuthAndRole('admin'), createRole);
router.get('/get', requireAuthAndRole('admin'), getRoles);
router.get('/get/:id', requireAuthAndRole('admin'), getRoleById);
router.put('/update/:id', requireAuthAndRole('admin'), updateRole);
router.delete('/delete/:id', requireAuthAndRole('admin'), deleteRole);
router.delete('/delete-bulk', requireAuthAndRole('admin'), deleteRoles)

module.exports = router;