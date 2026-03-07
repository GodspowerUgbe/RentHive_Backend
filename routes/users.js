const { Router } = require('express');
const {
  getMe,
  updateMe,
  updateAvatar,
  getUserById,
  updateUserRole,
  blockUser,
} = require('../controllers/userController.js');

const router = Router();

router.get('/me', getMe);
router.patch('/me', updateMe);
router.patch('/me/avatar', updateAvatar);

router.get('/:userId', getUserById);
router.patch('/:userId/role', updateUserRole);
router.patch('/:userId/block', blockUser);

module.exports = router;
