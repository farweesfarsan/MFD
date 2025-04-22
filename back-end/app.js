const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({path:path.join(__dirname,"config/.env")});

app.use(cors({
    origin: 'http://localhost:5173',  // Allow frontend URL
    credentials: true,  // Allow cookies & auth headers
}));


app.use(express.json());
const products = require('./route/product');
const auth = require('./route/auth');
const order = require('./route/order');
const payment = require('./route/payment');
const invoice = require('./route/invoice');
const errorMiddleware = require('./middleware/error');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use('/uploads',express.static(path.join(__dirname,'uploads')));

app.use('/mfd',products);
app.use('/user',auth);
app.use('/order',order);
app.use('/payment',payment);
app.use('/invoice',invoice);
app.use(errorMiddleware);

module.exports = app;