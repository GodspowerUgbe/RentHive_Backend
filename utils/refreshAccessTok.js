const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { promisify } = require('util');

const jwtSign = promisify(jwt.sign);

const signAccessTok = async (user) => {
  return await jwtSign({ id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

module.exports = { signAccessTok };