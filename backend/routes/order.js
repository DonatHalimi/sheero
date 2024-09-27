const express = require('express');
const { protect, requireAuthAndRole } = require('../middleware/auth');
const { checkoutSession, verifyOrder, getAllOrders, getUserOrders, getOrderById, updateDeliveryStatus, deleteOrders } = require('../controllers/orderController');

const router = express.Router();

router.post('/create-checkout-session', protect, checkoutSession);
router.post('/verify', verifyOrder); 
router.get('/get', requireAuthAndRole('admin'), getAllOrders);
router.get('/user/:userId', protect, getUserOrders);
router.get('/:orderId', protect, getOrderById);
router.put('/update-delivery-status', requireAuthAndRole('admin'), updateDeliveryStatus);
router.delete('/delete-bulk', requireAuthAndRole('admin'), deleteOrders);

module.exports = router;