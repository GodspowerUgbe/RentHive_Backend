const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');
const { signAccessTok } = require('../utils/refreshAccessTok.js');
const { signRefTok } = require('../utils/refreshToken.js');
const createError = require('../utils/createError.js');
const User = require('../models/User.js');
const { clearExpiredSession, verifyRefTok } = require('../utils/refreshToken.js');
const sendEmail = require('../utils/sendEmail.js');


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleService = async (idToken) => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();

  const { sub, email, name, picture } = payload;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      googleId: sub,
      email,
      name,
      avatar: picture,
      authProvider: 'google',
    });
  }

  const accessToken = await signAccessTok(user);
  const refreshToken = await signRefTok(user);
  user.sessions.push({
    refreshToken,
    accessToken,
    createdAt: new Date()
  });
  if (user.sessions.length >= 5) user.sessions.shift(); // Max 5 devices

  await user.save();

  return { accessToken, refreshToken };
};

const loginService = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createError('User not found', 404);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw createError('Invalid credentials', 401);
  }

  const accessToken = await signAccessTok(user);
  const refreshToken = await signRefTok(user);
  user.sessions.push({
    refreshToken,
    accessToken,
    createdAt: new Date()
  });
  if (user.sessions.length >= 5) user.sessions.shift(); // Max 5 devices

  await user.save();
  return { accessToken, refreshToken };
}

const logoutService = async (userId, refreshToken) => {
  let user;
  if (userId) {
    user = await User.findOne({
      _id: userId,
      'sessions.refreshToken': refreshToken
    });
  }
  else {
    user = await User.findOne({
      'sessions.refreshToken': refreshToken
    });
  }

  if (!user) throw createError('Session not found for this user', 404);
  await clearExpiredSession(refreshToken);
  return true;
};

const refreshService = async (oldAccessToken, providedRefTok) => {
  const decoded = await verifyRefTok(providedRefTok);
  if (!decoded) throw createError('Invalid token', 401);

  const user = await User.findOne({
    _id: decoded.id, 
    'sessions.refreshToken': providedRefTok
  });

  if (!user) {
    throw createError('Session not found', 401);
  }

  const session = user.sessions.find(s => s.refreshToken === providedRefTok);

  const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
  if (session.createdAt < sixtyDaysAgo) {
    user.sessions.pull({ _id: session._id });
    await user.save();
    throw createError('Token Expired. Please Login again', 403);
  }

  const newAccessToken = await signAccessTok(user);
  const newRefreshToken = await signRefTok(user);

  session.accessToken = newAccessToken;
  session.refreshToken = newRefreshToken;
  session.createdAt = new Date();

  await user.save();
  return { newAccessToken, newRefreshToken };
};


const registerService = async (email, password, name) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError('Email already in use', 409);
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    email,
    password: hashedPassword,
    name,
    sessions: []
  });

  const accessToken = await signAccessTok(user);
  const refreshToken = await signRefTok(user);

  user.sessions.push(
    {
      refreshToken,
      accessToken,
      createdAt: new Date()
    }
  )

  await user.save();
  return { accessToken, refreshToken };
}

const verifyEmail = async (token) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw createError('Verification token is invalid or expired', 400);
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;

  await user.save();

  return { message: 'Email verified successfully' };
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw createError('No user found with this email', 404);
  }

  const resetToken = crypto.randomBytes(32).toString('hex');

  user.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 mins

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.FRONTEND_URL}reset-password?token=${resetToken}`;

  await sendEmail({
    to: user.email,
    subject: 'Password Reset',
    html: `<h2>Password Reset</h2>
<p>Tap the button below to reset your password in the app.</p>
<a href="yourapp://reset-password?token=abc123">Reset Password</a>
`,
  });

  return { message: 'Password reset email sent' };
}

const resetPassword = async (token, newPassword) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw createError('Token is invalid or expired', 400);
  }

  user.password = await bcrypt.hash(newPassword, 12);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.passwordChangedAt = Date.now();

  await user.save();

  return { message: 'Password reset successful' };
};

module.exports = { googleService, loginService, logoutService, refreshService, registerService, verifyEmail, forgotPassword, resetPassword };