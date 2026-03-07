const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const createError = require('../utils/createError.js');
const User = require('../models/User.js');

const jwtVerify = promisify(jwt.verify);

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = await jwtVerify(token, process.env.JWT_SECRET);
        console.log(decoded)

        const user = await User.findOne({
            _id: decoded.id,
            'sessions.accessToken': token
        });
        if (!user) throw createError('User not found', 404);


        req.user = user;
        next();
    } catch (err) {
        console.log(err)
        const message = err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
        next(createError(message, 403));
    }
};

module.exports = authMiddleware;