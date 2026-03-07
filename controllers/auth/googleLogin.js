const { googleService } = require('../../services/authService.js');

const googleLogin = async (req, res) => {
    console.log('Google login attempt');
    const { idToken } = req.body;
    try {
        const { accessToken, refreshToken } = await googleService(idToken);
        res.status(200).json({ accessToken, refreshToken });
    } catch (err) {
        console.error(err)
        res.status(401).json({ message: 'Google authentication failed' });
    }
};

module.exports = googleLogin;
