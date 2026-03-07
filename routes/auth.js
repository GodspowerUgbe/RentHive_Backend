const express = require('express')
const login = require('../controllers/auth/login');
const logout = require('../controllers/auth/logout');
const refresh = require('../controllers/auth/refresh');
const verifyEmail = require('../controllers/auth/verifyEmail');
const forgotPassword = require('../controllers/auth/forgotPassword');
const resetPassword = require('../controllers/auth/resetPassword');
const authMiddleware = require('../middlewares/auth');
const register = require('../controllers/auth/register');
const googleLogin = require('../controllers/auth/googleLogin');

const Router = express.Router();

Router.post('/login', login)
    .post('/register', register)
    .post('/google', googleLogin)
    .post('/refresh', refresh)
    .post('/logout', logout)
    .use(authMiddleware)
    .post('/verify-email', verifyEmail)
    .post('/forgot-password', forgotPassword)
    .post('/reset-password', resetPassword);


module.exports = Router;
