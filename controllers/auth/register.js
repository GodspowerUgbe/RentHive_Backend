const {registerService} = require('../../services/authService');
const createError = require('../../utils/createError');

const register = async (req, res, next) => {
    const { email, password,name, } = req.body;

    if(!(email && password && name)){
        throw createError('Email,password, and name are required',401);
    }

    try {
        const { accessToken, refreshToken } = await registerService(email, password,name);
        res.status(201).json({ accessToken, refreshToken });

    } catch (err) {
        next(err);
    }
};

module.exports = register;