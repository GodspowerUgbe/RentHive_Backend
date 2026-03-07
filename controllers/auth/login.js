const createError = require('../../utils/createError');
const {loginService} = require('../../services/authService.js');

const login = async (req, res, next) => {
    const { email, password } = req.body;
    if(!email || !password){
        throw createError('No email or password',401)
    }

    try {
        const { accessToken, refreshToken } = await loginService(email, password);
        res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
        throw createError(error.statusCode? error.message : 'Internal server error',error.statusCode || 500);
    }
}

module.exports = login;
        