const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getSellerOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/seller-orders', protect, authorize('farmer', 'processor'), getSellerOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, authorize('farmer', 'processor', 'admin'), updateOrderStatus);
router.put('/:id/payment', protect, updatePaymentStatus);

module.exports = router;