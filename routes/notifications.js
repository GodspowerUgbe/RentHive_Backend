const { Router } = require('express');
const {
  getNotifications,
  markNotificationRead,
} = require('../controllers/notificationController.js');

const router = Router();

router.get('/', getNotifications);
router.patch('/:notificationId/read', markNotificationRead);

module.exports = router;
