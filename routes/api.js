const express = require('express');
const authRouter = require('./auth');
const mapsRoutes = require('./maps');
const aiRoutes = require('./ai');
const userRoutes = require('./users');
const houseRoutes = require('./houses');
const chatRoutes = require('./chat');
const escrowRoutes = require('./escrow');
const notificationRoutes = require('./notifications');
const uploadRoutes = require('./uploads');
const authMiddleware = require('../middlewares/auth');
const admin = require('./admin');


const Router = express.Router();

Router.use('/auth', authRouter)
    .use(authMiddleware)

    .use('/maps', mapsRoutes)         
    .use('/ai', aiRoutes)
    .use('/users', userRoutes)
    .use('/houses', houseRoutes)
    .use('/chat', chatRoutes)
    .use('/escrow', escrowRoutes)
    .use('/notifications', notificationRoutes)
    .use('/admin', admin)
    .use('/uploads', uploadRoutes);



module.exports = Router;