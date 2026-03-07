const { Router } = require('express');
const {
  createChat,
  getChats,
  getChatById,
  sendMessage,
  getMessages,
} = require('../controllers/chatController.js');

const router = Router();

router.post('/', createChat);
router.get('/', getChats);
router.get('/:chatId', getChatById);

router.post('/:chatId/messages', sendMessage);
router.get('/:chatId/messages', getMessages);

module.exports = router;
