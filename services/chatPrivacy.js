const Block = require('../models/Block.js');
const Report = require('../models/Report.js');
const Conversation = require('../models/Conversation.js');
const createError = require('../utils/createError.js');

const blockUser = async (blockerId, blockedId) => {
  const exists = await Block.findOne({ blocker: blockerId, blocked: blockedId });
  if (exists) return;

  await Block.create({ blocker: blockerId, blocked: blockedId });

  // Optional: archive conversations
  await Conversation.updateMany(
    { participants: { $all: [blockerId, blockedId] } },
    { $set: { archived: true } }
  );
};

const isBlocked = async (senderId, receiverId) => {
  return Block.exists({
    $or: [
      { blocker: senderId, blocked: receiverId },
      { blocker: receiverId, blocked: senderId },
    ],
  });
};

const reportUser = async ({
  reporterId,
  reportedUserId,
  reason,
  conversationId,
}) => {
  return Report.create({
    reporter: reporterId,
    reportedUser: reportedUserId,
    reason,
    conversation: conversationId,
  });
};

module.exports = {blockUser,isBlocked,reportUser};