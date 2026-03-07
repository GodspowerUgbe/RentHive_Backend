const getNotifications = async (userId, limit = 20, skip = 0) => {
  return await Notification.find({ user: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

const markNotificationRead = async (notificationId, userId) => {
  const notification = await Notification.findOne({
    _id: notificationId,
    user: userId,
  });

  if (!notification) throw new Error('Notification not found');

  notification.isRead = true;
  await notification.save();

  return notification;
};


module.exports = {
  getNotifications,
  markNotificationRead,
};