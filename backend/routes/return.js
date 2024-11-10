const express = require('express');
const { createReturnRequest, manageReturnRequest, getAllReturnRequests, getReturnRequestsByUser, deleteReturnRequest, deleteReturnRequests } = require('../controllers/returnController');
const { requireAuth, requireAuthAndRole } = require('../middleware/auth');

const router = express.Router();

router.post('/create', requireAuth, createReturnRequest);
router.put('/manage', requireAuthAndRole('admin'), manageReturnRequest);
router.get('/get', requireAuthAndRole('admin'), getAllReturnRequests);
router.get('/user/:userId', requireAuth, getReturnRequestsByUser);
router.delete('/delete/:id', requireAuthAndRole('admin'), deleteReturnRequest);
router.delete('/delete-bulk', requireAuthAndRole('admin'), deleteReturnRequests);

module.exports = router;
