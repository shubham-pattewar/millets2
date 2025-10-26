const express = require('express');
const router = express.Router();
const {
  getPendingProducts,
  verifyProduct,
  getAllUsers,
  updateUserStatus,
  getAnalytics,
  deleteUser
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.get('/products/pending', getPendingProducts);
router.put('/products/:id/verify', verifyProduct);
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/analytics', getAnalytics);

module.exports = router;