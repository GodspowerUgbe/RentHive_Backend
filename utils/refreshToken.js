const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {promisify} = require('util');

const jwtSign = promisify(jwt.sign);
const jwtVerify = promisify(jwt.verify);

const signRefTok = async (user) => {
    return await jwtSign({ id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '60d' });
}

const verifyRefTok = async (token) => {
  try {
    const decoded = await jwtVerify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return false;
  }
};

const clearExpiredSession = async (refToken, user) => {
  try {
    if(user){
      user.sessions = user.sessions.filter(s => s.refreshToken !== refToken);
      await user.save();
      return;
    }
    await User.updateOne({
        'sessions.refreshToken': refToken
    }, {
        $pull: {
            sessions: {
                refreshToken: refToken
            }
        }
    });
  } catch (error) {
    console.error('Error clearing expired tokens:', error);
  }
};

module.exports = {verifyRefTok, clearExpiredSession,signRefTok};
