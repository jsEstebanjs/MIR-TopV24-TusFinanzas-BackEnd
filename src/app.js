require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const userRouter = require('./api/user/user.route')


const app = express();
app.use(express.json())
app.user('/auth',userRouter)

app.use(morgan("dev"))

module.exports = app