const express = require('express');
const dotenv = require('dotenv');

const handleError = require('./middlewares/error');
const Router = require('./routes/api');
const app = express();

dotenv.config();

app.use(express.json());
app.use('/api', Router);

app.use(handleError);



module.exports = app;
