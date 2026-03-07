const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  googleId: {
    type: String,
    index: true,
    unique: true,
    sparse: true
  },
  email: {
    type: String,
    unique: true,
    index: true
  },
  bio:{
    type: String,
    default: ''
  },
  password: {
    type: String,
  },
  tel: {
    type: String
  },
  verified: {
    type: Boolean,
    default: false
  },
  profilePic: {
    type: String,
  },
  role: [{
    type: String,
    enum: ['user', 'admin', 'houseOwner'],
    default: 'user'
  }],
  sessions: [{
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    deviceInfo: String
  }],
  isEmailVerified: {
    type: Boolean,
    default: false,
  },

  emailVerificationToken: String,
  emailVerificationExpires: Date,

  passwordResetToken: String,
  passwordResetExpires: Date,

  passwordChangedAt: Date,


}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;