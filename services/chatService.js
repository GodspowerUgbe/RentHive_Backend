const Conversation = require('../models/Conversation.js');
const createError = require('../utils/createError.js');


const createChat = async (participants,type='direct') => {
  return Conversation.create({
    participants,
    type
  });
}

const getChats = async (userId) => {
  return Conversation.find({
    participants: userId,
  })
    .populate('participants', 'name avatar')
    .populate({
      path: 'lastMessage',
      select: 'content createdAt senderType',
    })
    .sort({ updatedAt: -1 });
};



const getChatById = async (chatId, userId) => {
  const chat = Conversation.findById(chatId);
  if (!chat.participants.includes(userId)) {
    throw createError('Unauthorised request', 403);
  }
  return chat;
}

const sendMessage = async ({
  conversationId,
  senderId,
  receiverId,
  content,
  messageType = 'text',
}) => {
  if (!content) throw createError('Message content required', 400);

  let conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    conversation = createChat([ senderId, receiverId, ],'direct');
  }

  const message = await Message.create({
    conversation: conversationId,
    sender: senderId,
    senderType: 'user',
    content,
    messageType,
  });

  conversation.lastMessage = message._id;
  await conversation.save();

  return message;
};


const getMessages = async (
  conversationId,
  limit = 30,
  skip = 0
) => {
  return Message.find({ conversation: conversationId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

const markMessagesAsRead = async (conversationId, userId) => {
  await Message.updateMany(
    {
      conversation: conversationId,
      sender: { $ne: userId },
      isRead: false,
    },
    { isRead: true }
  );
};

const deleteChat = async (conversationId, userId) => {
  const convo = await Conversation.findOne({
    _id: conversationId,
    participants: userId,
  });

  if (!convo) throw new AppError('Conversation not found', 404);

  await Message.deleteMany({ conversation: conversationId });
  await convo.deleteOne();
};


module.exports = {
  createChat,
  getChats,
  getChatById,
  sendMessage,
  getMessages,
  markMessagesAsRead,
  deleteChat
}