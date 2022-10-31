require('dotenv').config();
const express = require('express');

//aca importamos rutas

const app = express();

app.use(express.json())

module.exports = app