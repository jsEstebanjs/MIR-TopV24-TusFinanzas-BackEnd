require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const userRouter = require('./api/user/user.route');
const transactionsRouter = require('./api/transactions/transactions.route');

const app = express();
app.use(express.json())
app.use('/auth',userRouter)
app.use('/transactions',transactionsRouter)
app.use(morgan("dev"))

module.exports = app