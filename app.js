const express = require('express');
const app = express();

app.use(express.json());
const products = require('./route/product');
const auth = require('./route/auth');
const errorMiddleware = require('./middleware/error');
const cookieParser = require('cookie-parser');

app.use(cookieParser());

app.use('/mfd',products);
app.use('/user',auth);
app.use(errorMiddleware);

module.exports = app;