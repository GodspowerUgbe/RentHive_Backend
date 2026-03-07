const createError = require('../../utils/createError');
const {refreshService} = require('../../services/authService.js');

const refreshController = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const oldAccessToken = authHeader && authHeader.split(' ')[1];

        const { refreshToken } = req.body;

        if (!refreshToken) {
            throw createError('Refresh token is required',400);
        }

        if (!oldAccessToken) {
            throw createError(401, 'token is required');
        }

        const { newAccessToken, newRefreshToken } = await refreshService(oldAccessToken,refreshToken);

        res.status(200).json({ newAccessToken, newRefreshToken });

    } catch (error) {
        next(error);
    }
};

module.exports = refreshController;
