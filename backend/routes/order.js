const express = require('express');
const { requireAuth, requireAuthAndRole } = require('../middleware/auth');
const { payWithStripe, verifyOrder, payWithCash, getAllOrders, getUserOrders, getOrderById, updateDeliveryStatus, deleteOrders, deleteOrder } = require('../controllers/orderController');

const router = express.Router();

router.post('/payment/stripe', requireAuth, payWithStripe);
router.post('/payment/cash', requireAuth, payWithCash);
router.post('/verify', verifyOrder);
router.get('/get', requireAuthAndRole(['admin', 'orderManager']), getAllOrders);
router.get('/user/:userId', requireAuth, getUserOrders);
router.get('/:orderId', requireAuth, getOrderById);
router.put('/status/update', requireAuthAndRole(['admin', 'orderManager']), updateDeliveryStatus);
router.delete('/delete/:id', requireAuthAndRole('admin'), deleteOrder);
router.delete('/delete-bulk', requireAuthAndRole('admin'), deleteOrders);

module.exports = router;