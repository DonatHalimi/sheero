const express = require('express');
const { protect, requireAuthAndRole } = require('../middleware/auth');
const { checkoutSession, verifyOrder, getAllOrders, getUserOrders, getOrderById, updateOrderStatus, updateDeliveryStatus, deleteOrders } = require('../controllers/orderController');

const router = express.Router();

router.post('/create-checkout-session', protect, checkoutSession);
router.get('/verify', protect, verifyOrder);
router.get('/get', requireAuthAndRole('admin'), getAllOrders);
router.get('/user/:userId', protect, getUserOrders);
router.get('/:orderId', protect, getOrderById);
router.put('/update-status/:id', requireAuthAndRole('admin'), updateOrderStatus);
router.put('/update-delivery-status', requireAuthAndRole('admin'), updateDeliveryStatus);
router.delete('/delete-bulk', requireAuthAndRole('admin'), deleteOrders);

module.exports = router;