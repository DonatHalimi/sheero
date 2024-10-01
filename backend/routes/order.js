const express = require('express');
const { protect, requireAuthAndRole } = require('../middleware/auth');
const { payWithStripe, verifyOrder, payWithCash, getAllOrders, getUserOrders, getOrderById, updateDeliveryStatus, deleteOrders } = require('../controllers/orderController');

const router = express.Router();

router.post('/payment/stripe', protect, payWithStripe);
router.post('/payment/cash', protect, payWithCash);
router.post('/verify', verifyOrder);
router.get('/get', requireAuthAndRole('admin'), getAllOrders);
router.get('/user/:userId', protect, getUserOrders);
router.get('/:orderId', protect, getOrderById);
router.put('/update-delivery-status', requireAuthAndRole('admin'), updateDeliveryStatus);
router.delete('/delete-bulk', requireAuthAndRole('admin'), deleteOrders);

module.exports = router;