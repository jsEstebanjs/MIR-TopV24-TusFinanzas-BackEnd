require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const userRouter = require('./api/user/user.route');
const transactionsRouter = require('./api/transactions/transactions.route');
const categoriesRouter = require('./api/categories/categories.route');
const subcategoriesRouter = require('./api/subCategories/subCategories.route')
const mediaRoute = require('./api/multimedia/media.route')
const cors = require('cors')

const app = express();
app.use(express.json())
app.use(cors({
    "origin": `${process.env.ORIGIN}`,
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
  }))
app.use('/users',userRouter)
app.use('/transactions',transactionsRouter)
app.use('/categories',categoriesRouter)
app.use('/subcategories',subcategoriesRouter)
app.use(mediaRoute)
app.use(morgan("dev"))

module.exports = app