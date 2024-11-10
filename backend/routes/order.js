const express = require('express');
const { requireAuth, requireAuthAndRole } = require('../middleware/auth');
const { payWithStripe, verifyOrder, payWithCash, getAllOrders, getUserOrders, getOrderById, updateDeliveryStatus, deleteOrders } = require('../controllers/orderController');

const router = express.Router();

router.post('/payment/stripe', requireAuth, payWithStripe);
router.post('/payment/cash', requireAuth, payWithCash);
router.post('/verify', verifyOrder);
router.get('/get', requireAuthAndRole('admin'), getAllOrders);
router.get('/user/:userId', requireAuth, getUserOrders);
router.get('/:orderId', requireAuth, getOrderById);
router.put('/status/update', requireAuthAndRole('admin'), updateDeliveryStatus);
router.delete('/delete-bulk', requireAuthAndRole('admin'), deleteOrders);

module.exports = router;