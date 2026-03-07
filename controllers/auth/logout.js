const {logoutService} = require('../../services/authService.js');
const createError = require('../../utils/createError.js');


const logout = async (req, res, next) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        throw createError('Refresh token is required for logout',400);
    }
    const status = await logoutService(req?.user?._id, refreshToken);
    if(!status) {
        throw createError('Failed to log out',500);
    }
    console.log('done')
    res.status(204).json({
        message: 'Logged out successfully'
    });
};

module.exports = logout;