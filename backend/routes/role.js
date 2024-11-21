const express = require('express');
const { createRole, getRoles, getRoleById, updateRole, deleteRole, deleteRoles } = require('../controllers/roleController');
const { requireAuthAndRole } = require('../middleware/auth');
const { createSchema, getByIdSchema, updateSchema, deleteSchema, deleteBulkSchema } = require('../validations/role');
const validate = require('../middleware/validation');

const router = express.Router();

router.post('/create', requireAuthAndRole('admin'), validate(createSchema), createRole);
router.get('/get', requireAuthAndRole('admin'), getRoles);
router.get('/get/:id', requireAuthAndRole('admin'), validate(getByIdSchema), getRoleById);
router.put('/update/:id', requireAuthAndRole('admin'), validate(updateSchema), updateRole);
router.delete('/delete/:id', requireAuthAndRole('admin'), validate(deleteSchema), deleteRole);
router.delete('/delete-bulk', requireAuthAndRole('admin'), validate(deleteBulkSchema), deleteRoles)

module.exports = router;