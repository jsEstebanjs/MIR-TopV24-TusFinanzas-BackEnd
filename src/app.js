require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const userRouter = require('./api/user/user.route');
const transactionsRouter = require('./api/transactions/transactions.route');
const categoriesRouter = require('./api/categories/categories.route');
const subCategoriesRouter = require('./api/subCategories/subCategories.route')
const cors = require('cors')

const app = express();
app.use(express.json())
app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
  }))
app.use('/users',userRouter)
app.use('/transactions',transactionsRouter)
app.use('/categories',categoriesRouter)
app.use('/subCategories',subCategoriesRouter)
app.use(morgan("dev"))

module.exports = app