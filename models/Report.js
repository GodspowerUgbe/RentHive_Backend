const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    reportedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    reason: {
      type: String,
      required: true,
    },

    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
    },

    status: {
      type: String,
      enum: ['pending', 'reviewed', 'actioned'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report',reportSchema);
