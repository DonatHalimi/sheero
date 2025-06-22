const express = require('express');
const { createReturnRequest, manageReturnRequest, getAllReturnRequests, getReturnRequestById, getUserReturnRequests, deleteReturnRequest, deleteReturnRequests } = require('../controllers/returnController');
const { requireAuth, requireAuthAndRole } = require('../middleware/auth');
const { createSchema, manageSchema, getByIdSchema, deleteSchema, deleteBulkSchema } = require('../validations/return');
const validate = require('../middleware/validation');

const router = express.Router();

router.post('/create', requireAuth, validate(createSchema), createReturnRequest);
router.put('/manage', requireAuthAndRole('admin'), validate(manageSchema), manageReturnRequest);
router.get('/get', requireAuthAndRole('admin'), getAllReturnRequests);
router.get('/user/:userId', requireAuth, getUserReturnRequests);
router.get('/:returnId', requireAuth, validate(getByIdSchema), getReturnRequestById);
router.delete('/delete/:id', requireAuthAndRole('admin'), validate(deleteSchema), deleteReturnRequest);
router.delete('/delete-bulk', requireAuthAndRole('admin'), validate(deleteBulkSchema), deleteReturnRequests);

module.exports = router;