const User = require('../models/User');

exports.createNotification = async (userId, notification) => {
  try {
    const user = await User.findById(userId);
    if (user) {
      user.notifications.push(notification);
      await user.save();
    }
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

exports.sendNotificationToAdmins = async (io, notification) => {
  try {
    const admins = await User.find({ role: 'admin' });
    admins.forEach(admin => {
      io.to(admin._id.toString()).emit('notification', notification);
    });
  } catch (error) {
    console.error('Error sending notification to admins:', error);
  }
};