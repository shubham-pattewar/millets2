const express = require('express');
const router = express.Router();
const {
  updateProfile,
  getProfile,
  getNotifications,
  markNotificationRead,
  getUserById
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/fileUpload');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.single('profileImage'), updateProfile);
router.get('/notifications', protect, getNotifications);
router.put('/notifications/:notificationId/read', protect, markNotificationRead);
router.get('/:id', getUserById);

module.exports = router;