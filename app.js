const express = require('express');
const app = express();

app.use(express.json());
const products = require('./route/product');
const errorMiddleware = require('./middleware/error');

app.use('/mfd',products);
app.use(errorMiddleware);

module.exports = app;