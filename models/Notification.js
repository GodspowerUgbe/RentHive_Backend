const mongoose = require( 'mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        'new_message',
        'new_comment',
        'reaction',
        'escrow_funded',
        'escrow_released',
        'escrow_disputed',
        'escrow_refunded',
        'report_update',
        'system',
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    data: {
      type: Object,
      default: {}, // houseId, escrowId, conversationId, etc.
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
